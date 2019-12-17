<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Autodesk;

class Viewer extends Controller
{
    public function index()
    {
        //require_once('../vendor/autoload.php');
        //$this->getSensorsData();

        Autodesk\Auth\Configuration::getDefaultConfiguration()
            ->setClientId(env('AUTODESK_CLIENT_ID'))
            ->setClientSecret(env('AUTODESK_CLIENT_SECRET'));

        $twoLeggedAuth = new Autodesk\Auth\OAuth2\TwoLeggedAuth();
        $twoLeggedAuth->setScopes(['data:read', 'data:write', 'data:create', 'bucket:read', 'bucket:create', 'bucket:delete']);

        $twoLeggedAuth->fetchToken();
        $tokenInfo = [
            'applicationToken' => $twoLeggedAuth->getAccessToken(),
            'expiry'           => time() + $twoLeggedAuth->getExpiresIn(),
        ];
        return view('viewer', ['tokenInfo' => $tokenInfo, 'sensorsData' => $this->getSensorsData()]);
    }

    function getSensorsData()
    {
        $request = curl_init();
        $apiKey = "X-API-KEY:" . env('THIGDUST_KEY');
        $url = env('THIGDUST_URL'); 

        $headers = array();
        $headers[] = $apiKey;

        curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($request, CURLOPT_URL, $url);
        curl_setopt($request, CURLOPT_HTTPHEADER, $headers);

        $response = json_decode(curl_exec($request), true);

        return $response;
    }
}

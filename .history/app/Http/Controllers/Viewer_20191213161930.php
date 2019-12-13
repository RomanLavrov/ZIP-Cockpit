<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Autodesk;

class Viewer extends Controller
{
    public function index()
    {
        //require_once('../vendor/autoload.php');

        Autodesk\Auth\Configuration::getDefaultConfiguration()
            ->setClientId('kMWAAeIB51liNiGKGDSRfXG0HxCFDMsg')
            ->setClientSecret('Dd2hpi5NjiDexoym');

        $twoLeggedAuth = new Autodesk\Auth\OAuth2\TwoLeggedAuth();
        $twoLeggedAuth->setScopes(['data:read', 'data:write','data:create','bucket:read','bucket:create', 'bucket:delete']);

        $twoLeggedAuth->fetchToken();
        $tokenInfo = [
            'applicationToken' => $twoLeggedAuth->getAccessToken(),
            'expiry'           => time() + $twoLeggedAuth->getExpiresIn(),
        ];
        return view('viewer', ['tokenInfo'=>$tokenInfo]);
    }

    private function getSensorsData(){
        $request = curl_init();
        $apiKey = "X-API-KEY: LIXAFFHQ6SVFIJREJGKGFZEUUDJJ4MHFVIERRRNFYBY9VKGJTYYZZHZKXHQUYJQM";

        $headers = array();
        $headers[] = $apiKey;


    }
}

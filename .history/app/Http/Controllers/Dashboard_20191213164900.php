<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use View;
use DB;
use Config;

class Dashboard extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = DB::table('Rooms')->get();
        return view('master', ['data' => $data, ""]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    function getSensorsData(){
        $request = curl_init();
        $apiKey = "X-API-KEY: LIXAFFHQ6SVFIJREJGKGFZEUUDJJ4MHFVIERRRNFYBY9VKGJTYYZZHZKXHQUYJQM";
        $url = "https://innovationspark.cust.prod.thingdust.io/api/v2/get_space_states";

        $headers = array();
        $headers[] = $apiKey;

        curl_setopt($request, CURLOPT_URL, $url);
        curl_setopt($request, CURLOPT_HTTPHEADER, $headers);

        $response = json_decode(curl_exec($request), true);

        /*
        echo("<pre>");
        print_r("RESPONSE".$response);
        echo("</pre>");*/

        return $response;
    }
}

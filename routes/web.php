<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', 'Dashboard@index');

Route::get('/Dashboard', 'Dashboard@index'); 
Route::get('/Areal', 'Areal@index');
Route::get('/Viewer', 'Viewer@index');



<?php

use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/schedules/{id}', [ScheduleController::class, 'update']);
Route::post('/get/schedules/{id}', [ScheduleController::class, 'getData']);
Route::post('/suppliers', [ScheduleController::class, 'sendMail']);
Route::post('/imap', [\App\Http\Controllers\EmailController::class, 'saveDraft']);

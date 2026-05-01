<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->file(public_path('ramesh_portfolio.html'));
});

Route::get('/terminal', function () {
    return response()->file(public_path('ramesh_notebook_terminal.html'));
});

Route::get('/editorial', function () {
    return response()->file(public_path('ramesh_notebook_editorial.html'));
});

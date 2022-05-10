<?php

function invokeForm($method, $function, $query) {
    if ($method === "POST") {
        if (count($function) === 1 && $function[0] === "category") _create_category();
    } elseif ($method === "GET") {

    } else bad_method();
}

function _create_category() {
    $errors = [];
    // todo permission

    $title = trim($_POST["title"]??"");
    $description = trim($_POST["description"]??"");
    $view = trim($_POST["view"]??-1);
    $create = trim($_POST["create"]??-1);

    if (strlen($title) < 5 || strlen($title) > 100) $errors["title"] = 'Le titre doit contenir au minimum 5 caractéres et au maximum 100 !';
    if (strlen($description) < 5 || strlen($description) > 100) $errors["description"] = 'La description doit contenir au mximum 255 caractéres !';

    if (!in_array($view, [0, 1, 2, 3]))  $errors["view"] = 'La préférence de vue est invalide !';
    if (!in_array($create, [0, 1, 2, 3]))  $errors["view"] = 'La préférence de création est invalide !';

    if (count($errors) === 0) {
        create_category($title, $description, $view, $create);
        success();
    } else bad_request($errors);
}
<?php

function invokeForm($method, $function, $query) {
    if ($method === "POST") {
        if (count($function) === 1 && $function[0] === "category") _create_category();
        elseif (count($function) === 1 && $function[0] === "topic") _create_topic();
    } elseif ($method === "GET") {
        if (count($function) === 2 && $function[0] == "category") {
            if ($function[1] === "all")  _get_all_category();
            else _get_category($function[1]);
        } elseif (count($function) === 3 && $function[0] == "category" && $function[2] === "topics") {
           _get_topic_from_category($function[1], $query);
        }
    } else bad_method();
}


// GET

function _get_all_category() {
    $category = get_all_visible_category(FORUM_PERMISSION_VIEW_ADMIN);
    http_response_code(200);
    echo json_encode(["code" => 200, "data" => $category]);
    exit();
}

function _get_category($id) {
    if (empty($id)) bad_request('invalid category');
    $cat = get_category($id);
    if (!$cat) bad_request('invalid category');

    http_response_code(200);
    echo json_encode(["code" => 200, "data" => $cat]);
    exit();
}

function _get_topic($id) { }

// todo: pagination

function _get_topic_from_category($id, $query) {
    $limit = max(50, $query['limit']??10);

//    if (empty($id)) bad_request('invalid category');
//
//    $db = connectDB();
//    $req = $db->prepare('SELECT name, category, date_inserted FROM PAE_FORUM_TOPIC' );



}

function _get_messages() {};

// POST

function _create_message() {

}

function _create_topic() {
    $db = connectDB();
//    $user = ["id" => 1];
    $user = ns_get_current_user($db);
//
    if (!$user) unauthorized();

    $errors = [];

    $category = $_POST["category"]??"";
    $title = trim($_POST["title"]??"");
    $message = $_POST["message"]??"";


    if (empty($category)) bad_request('invalid category');
    $cat = get_category($category);
    if (!$cat) bad_request('invalid category');

    if (strlen($title) < 5 || strlen($title) > 100) $errors["title"] = 'Le titre doit contenir au minimum 5 caractéres et au maximum 100 !';
    if (strlen($message) < 10 || strlen($message) > 2000) $errors["$message"] = 'Le $message doit contenir au minimum 10 caractéres et au maximum 2000 !';

    if (count($errors) !== 0) bad_request($errors);

    $req = $db->prepare("INSERT INTO PAE_FORUM_TOPIC (name, category) VALUE (?, ?)");
    $req->execute([$title, $cat["id"]]);

    $req = $db->prepare("INSERT INTO PAE_FORUM_MESSAGE (author, topic, content) VALUE (:author, (SELECT id FROM PAE_FORUM_TOPIC WHERE name=:topic ORDER BY date_inserted desc LIMIT 1), :content)");
    $req->execute([
        "author" => $user["id"],
        "topic" => $title,
        "content" => $message
    ]);
    success();
}

function _create_category() {
    $errors = [];
    // todo permission

    $title = trim($_POST["title"]??"");
    $description = trim($_POST["description"]??"");
    $view = trim($_POST["view"]??-1);
    $create = trim($_POST["create"]??-1);

    if (strlen($title) < 5 || strlen($title) > 100) $errors["title"] = 'Le titre doit contenir au minimum 5 caractéres et au maximum 100 !';
    if (strlen($description) > 255) $errors["description"] = 'La description doit contenir au maximum 255 caractéres !';

    if (!in_array($view, [0, 1, 2, 3]))  $errors["view"] = 'La préférence de vue est invalide !';
    if (!in_array($create, [0, 1, 2, 3]))  $errors["view"] = 'La préférence de création est invalide !';

    if (count($errors) === 0) {
        create_category($title, $description, $view, $create);
        success();
    } else bad_request($errors);
}

// like / dislike
function _like_message() {}

// DELETE

function _block_message() {}

function _delete_message() {}

function _delete_topic() {}

function _delete_category() {}

// EDIT

function _edit_category() {}

function _edit_topic() {}

// content ; reply ;
function _edit_message() {}
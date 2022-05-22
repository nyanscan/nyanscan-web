<?php

require 'config.php';
require 'DBAdapter.php';
require 'User.php';
require 'Picture.php';
require 'const.php';

/**
 * @deprecated
 * @return PDO|void
 */
function connectDB() {
    try {
        $pdo = new PDO(DB_DRIVER.":host=".DB_HOST.";dbname=".DB_NAME.";port=".DB_PORT, DB_USER, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (Exception $e) {
        die("SQL Exception". $e->getMessage());
    }
}

function getDB(): DBAdapter
{
    return DBAdapter::$db_adapter_instance?:new DBAdapter();
}

function isConnected(): bool
{
    return get_log_user()->is_connected();
}


function get_log_user(): User
{
    return User::$current_user?:new User();
}

function createMD5Token(): string
{
    return md5(time()*rand(1,1320)."HF6Ty.%%l78d£");
}

function redirectIfConnected(){
    if(isConnected()){
        header("Location: /");
        die();
    }
}

function redirectIfNotConnected(){
    if(!isConnected()){
        header("Location: /");
        die();
    }
}

function redirect404() {
    http_response_code(404);
    include $_SERVER['DOCUMENT_ROOT'] . '/error/404.php';
    die();
}
function json_exit($code, $message, $reason) {
    http_response_code($code);
    echo json_encode(["code" => $code, "message" => $message, "reason" => $reason]);
    exit();
}

function concatenate_array_by_prefix($array, $prefix) {
    $final = [];
    foreach ($array as $key => $value) {
        $split = explode('_', $key, 2);
        if (in_array($split[0],$prefix)) {
            if (!isset($final[$split[0]])) $final[$split[0]] = [$split[1] => $value];
            else $final[$split[0]][$split[1]] = $value;
        } else $final[$key] = $value;
    }
    return $final;
}

function download_file_from_post($from_name, $dest_path, $max_size=500000)  {
    if (empty($_FILES[$from_name])) return -1;
    if ($_FILES[$from_name]["size"] > $max_size) return  -2;

    $extend = strtolower(pathinfo(basename($_FILES[$from_name]['name']), PATHINFO_EXTENSION));
    $id = uniqid();
    $target_file = $dest_path . $id . '.' . $extend;
    if (move_uploaded_file($_FILES[$from_name]['tmp_name'], $target_file)) {
        return $target_file;
    } return -3;
}

function download_image_from_post($from_name, $type=[], $max_size=500000)  {
    $d_path = download_file_from_post($from_name, PICTURE_PATH . 'download_tmp/');
    if (is_numeric($d_path) && intval($d_path) < 0) {
        return $d_path;
    }
    $check = getimagesize($d_path);
    $format = PICTURE_FORMAT_NONE;
    switch ($check[2]) {
        case IMAGETYPE_PNG: $format = PICTURE_FORMAT_PNG; break;
        case IMAGETYPE_WEBP: $format = PICTURE_FORMAT_WEBP; break;
        case IMAGETYPE_JPEG: $format = PICTURE_FORMAT_JPG; break;
        case IMAGETYPE_GIF: $format = PICTURE_FORMAT_GIF; break;
    }
    if (!empty($type) && !in_array($format, $type)) $format = PICTURE_FORMAT_NONE;
    $pic = new Picture();
    $pic -> create($d_path, $format, true);
    return $pic;
}

function uniqidReal($lenght = 13) {
    // uniqid gives 13 chars, but you could adjust it to your needs.
    if (function_exists("random_bytes")) {
        $bytes = random_bytes(ceil($lenght / 2));
    } elseif (function_exists("openssl_random_pseudo_bytes")) {
        $bytes = openssl_random_pseudo_bytes(ceil($lenght / 2));
    } else {
        throw new Exception("no cryptographically secure random function available");
    }
    return substr(bin2hex($bytes), 0, $lenght);
}
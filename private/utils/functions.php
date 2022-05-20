<?php

require 'config.php';
require 'DBAdapter.php';
require 'User.php';

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
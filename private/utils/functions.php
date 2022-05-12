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

/**
 * @param $db
 * @return false|mixed
 * @deprecated
 */
function ns_get_current_user($db) {
    if(empty($_SESSION["token"]) || empty($_SESSION["account-id"]))
        return false;
    $db = $db?:connectDB();

    $queryPrepared = $db->prepare("SELECT id, username, email, birthday, status FROM ".DB_PREFIX."USER WHERE token=:token AND id=:id");

    $queryPrepared->execute([
        "token"=>$_SESSION["token"],
        "id"=>$_SESSION["account-id"]
    ]);

    return $queryPrepared->fetch();

}


function get_log_user(): User
{
    return User::$current_user?:new User();
}

/**
 * @deprecated
 * @param null $id
 * @return string
 */
function createToken($id = null) {
    $token = md5(time()*rand(1,456)."HF6Ty.%%l78d£");

    if(!is_null($id)){
        $pdo = connectDB();
        $queryPrepared = $pdo->prepare("UPDATE ".DB_PREFIX."USER SET token=:token WHERE id=:id");

        $queryPrepared->execute([
            "token"=>$token,
            "id"=>$id
        ]);
    }
    return $token;
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
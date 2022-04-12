<?php

require 'config.php';

function connectDB() {
    try {
        $pdo = new PDO(DB_DRIVER.":host=".DB_HOST.";dbname=".DB_NAME.";port=".DB_PORT, DB_USER, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (Exception $e) {
        die("SQL Exception". $e->getMessage());
    }
}


function isConnected() {
    if(empty($_SESSION["token"]))
        return false;

    $pdo = connectDB();
    $queryPrepared = $pdo->prepare("SELECT id FROM ".DB_PREFIX."USER WHERE token=:token AND id=:id");

    $queryPrepared->execute([
        "token"=>$_SESSION["token"],
        "id"=>$_SESSION["account-id"]
    ]);

    return $queryPrepared->fetch();
}

function createToken($id = null) {
    $token = md5(time()*rand(1,1320)."HF6Ty.%%l78d£");

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

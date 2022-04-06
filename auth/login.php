<?php

require ("../utils/dbAdapter.php");

session_start();

$errors = [];

if (count($_POST) != 2 ||
    empty($_POST["user"]) ||
    empty($_POST["password"])) {
    $errors[] = "Donnée du formulaire invalide merci de recommencer !";
} else {
    $user = trim(strtolower($_POST["user"]));
    $pwd = $_POST["password"];

    if (!filter_var($user, FILTER_VALIDATE_EMAIL)) $errors[]="Format de mail invalide";

    if (count($errors) === 0) {
        $pdo = connectDB();
        $rq_select = $pdo->prepare("SELECT id, password, username FROM ".DB_PREFIX."USER WHERE email=:email");
        $rq_select->execute(["email" => $user]);

        $user = $rq_select->fetchAll();
        if (count($user) === 0 || !password_verify($pwd, $user[0]["password"])) {
            $errors[] = "E-mail ou mot de passe invalide !";
        } else {
            $_SESSION["account-id"] = $user[0]["id"];
            $_SESSION["account-username"] = $user[0]["username"];
            header("Location: ./");
        }
    }
}

if (count($errors) > 0) {
    $_SESSION["errors"] = $errors;
    header("Location: index.php");
}


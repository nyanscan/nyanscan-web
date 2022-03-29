<?php

require ("../utils/dbAdapter.php");
require ("../utils/const.php");

session_start();

$errors = [];

if (
    (count($_POST) != 5 and count($_POST) != 6) ||
    empty($_POST["username"]) ||
    empty($_POST["email"]) ||
    empty($_POST["password"]) ||
    empty($_POST["password-v"]) ||
    empty($_POST["cgu"])
) {
    $errors[] = "Donnée du formulaire invalide merci de recommencer !";
} else {
    $username = trim($_POST["username"]);
    $email = strtolower(trim($_POST["email"]));
    $password = trim($_POST["password"]);
    $password_v = trim($_POST["password-v"]);
    $newsLetter = !empty($_POST["newsletter"]);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[]="Format de mail invalide";
    if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/', $username)) $errors[]="Le pseudo ne peux contenir que des miniscule, majuscles, chiffres ou un _ avec une longeur maximum de 20 caractéres";
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password)) $errors[]="Le mots de passe dois contenire au minimum 8 caractéres dont 1 majuscule 1 majuscule 1 chiffres et 1 caractéres spéciale";
    if ($password !== $password_v) $errors[]="Les motrs de passes de coresponde pas !";

    $pdo = connectDB();

    $rq_select = $pdo->prepare("SELECT email, username FROM ".DB_PREFIX."USER WHERE email=:email OR username=:username LIMIT 2");
    $rq_select->execute(["email" => $email, "username" => $username]);
    foreach ($rq_select->fetchAll() as $user) {
        if ($user["email"] === $email) $errors[]="Ce mail est dèja reliée à un compte";
        if ($user["username"] === $email) $errors[]="Ce nom d'utilisateur est dèja reliée à un compte";
    }

    if (count($errors) === 0 ) {

        $password = password_hash($password, PASSWORD_DEFAULT);

        $rq = $pdo->prepare("INSERT INTO ".DB_PREFIX."USER (email, username, password, status) VALUES (:email, :username, :password, :status)");
        $rq->execute([
            "email" => $email,
            "username" => $username,
            "password" => $password,
            "status" => $newsLetter ? STATUS_EMAIL_NEWS_LETTER : STATUS_NOTHING
        ]);
        header("Location: loginSucces.php");
    }
}
if (count($errors) !== 0) {
    $_SESSION["errors"] = $errors;
    header("Location: index.php");
}
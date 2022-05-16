<?php

function invokeAuth($method, $function, $query)
{
    if (count($function) === 1) {
        if ($method === "GET" && $function[0] === "logout") _logout();
        elseif ($method === "POST") {
            if ($function[0] === "login") _log();
            elseif ($function[0] === "register") _register();
        }
    }
}


function _logout()
{
    unset($_SESSION["token"]);
    unset($_SESSION["account-id"]);
    unset($_SESSION["account-username"]);
    success();
}

function _log()
{
    $user = get_log_user();
    if ($user->is_connected()) {
        bad_request('Already connect');
    }

    $username = trim(strtolower($_POST["user"]??""));
    $pwd = $_POST["password"]??"";

    if (!$username || !$pwd || !filter_var($username, FILTER_VALIDATE_EMAIL) || !$user->login($username, $pwd))
        bad_request('E-mail ou mot de passe invalide !');

    success();
}

function _register()
{
    $errors = [];
    if (
        (count($_POST) != 8 and count($_POST) != 9) ||
        empty($_POST["username"]) ||
        empty($_POST["email"]) ||
        empty($_POST["password"]) ||
        empty($_POST["password-v"]) ||
        empty($_POST["birth"]) ||
        empty($_POST["cgu"])
    ) {
        $errors[] = "Donnée du formulaire invalide merci de recommencer !";
    } else {
        $username = trim($_POST["username"]);
        $email = strtolower(trim($_POST["email"]));
        $password = trim($_POST["password"]);
        $password_v = trim($_POST["password-v"]);
        $newsLetter = !empty($_POST["newsletter"]);
        $newsLetter = !empty($_POST["newsletter"]);
        $birthday = $_POST["birth"];

        switch (get_captcha_status()) {
            case CAPTCHA_CODE_ERROR: $errors[] = "Captcha invalide."; break;
            case CAPTCHA_CODE_FALSE: $errors[] = "Merci de remplire correctement le captcha."; break;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Format de mail invalide";
        if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/', $username)) $errors[] = "Le pseudo ne peux contenir que des miniscule, majuscles, chiffres ou un _ avec une longeur maximum de 20 caractéres";
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password)) $errors[] = "Le mots de passe dois contenire au minimum 8 caractéres dont 1 majuscule 1 majuscule 1 chiffres et 1 caractéres spéciale";
        if ($password !== $password_v) $errors[] = "Les mots de passes de coresponde pas !";

        $birthdayExploded = explode("-", $birthday);

        if( count($birthdayExploded)!=3 || !checkdate($birthdayExploded[1], $birthdayExploded[2], $birthdayExploded[0]) ){
            $errors[] = "Date de naissance incorrecte";
        }else{
            $age = (time() - strtotime($birthday))/60/60/24/365.25;
            if($age<13 || $age>100){
                $errors[] = "Vous êtes trop jeune ou trop vieux";
            }
        }

        $rq_select = getDB()->get_pdo()->prepare("SELECT email, username FROM " . DB_PREFIX.TABLE_USER. " WHERE email=:email OR username=:username LIMIT 2");
        $rq_select->execute(["email" => $email, "username" => $username]);
        foreach ($rq_select->fetchAll(PDO::FETCH_ASSOC) as $user) {
            if ($user["email"] === $email) $errors[] = "Ce mail est dèja reliée à un compte";
            if ($user["username"] === $username) $errors[] = "Ce nom d'utilisateur est dèja reliée à un compte";
        }
        if (count($errors) === 0) {
            getDB()->insert(TABLE_USER, [
                "email" => $email,
                "username" => $username,
                "password" => password_hash($password, PASSWORD_DEFAULT),
                "birthday" => $birthday,
                "status" => $newsLetter ? STATUS_EMAIL_NEWS_LETTER : STATUS_NOTHING
            ]);
            success();
        }
    }
    bad_request($errors);
}

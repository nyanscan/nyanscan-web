<?php

function invokeAuth($method, $function, $query) {
    if (count($function) === 1) {
        if ($method === "GET" && $function[0] === "logout") {
            _logout();
        }
        if ($method === "GET" && $function[0] === "verification") {
            _verification($query);
        } elseif ($method === "POST") {
            if ($function[0] === "login") {
                _log();
            } elseif ($function[0] === "register") {
                _register();
            }
        }
    }
}

function _verification($query) {
    $token = $query["t"]??null;
    $user = $query["user"]??null;

    if ($token === null || $user === null) {
        bad_request('invalid query');
    }
    $req = getDB()->get_pdo()->prepare('SELECT V.token as token, U.email as email, U.username as username FROM '.DB_PREFIX.TABLE_VERIFICATION.' as V JOIN '.DB_PREFIX.TABLE_USER.' U ON U.id = V.user_id WHERE V.user_id=:user_id AND V.id=:id LIMIT 1');
    $req->execute(['id' => $token, 'user_id' => $user]);
    $r = $req->fetch(PDO::FETCH_ASSOC);
    if ($r) {
        send_verification_mail($r["token"], $user, $r["email"], $r["username"]);
        success();
    } else {
        bad_request();
    }
}

/**
 * @deprecated
 */
function _logout() {
    success();
}

function _log() {
    $user = get_log_user();
    if ($user->is_connected()) {
        bad_request('Already connect');
    }

    $username = trim(strtolower($_POST["user"]??""));
    $pwd = $_POST["password"]??"";

    if (!$username || !$pwd || !filter_var($username, FILTER_VALIDATE_EMAIL) || !$user->login($username, $pwd)) {
        bad_request('E-mail ou mot de passe invalide !');
    }

    if (!$user->is_verified()) {
        success([
            "invalid" => "not_verified",
            "user_id" => $user->getId(),
            "mail_token" => $user->get_verification_token()
        ]);
    }
    success([
		"token" => $user->get_token(),
	    "id" => $user->getId()
    ]);
}

function _register() {
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
        $errors[] = "Donnée du formulaire invalide ! Merci de recommencer.";
    } else {
        $username = trim($_POST["username"]);
        $email = strtolower(trim($_POST["email"]));
        $password = trim($_POST["password"]);
        $password_v = trim($_POST["password-v"]);
        $newsLetter = !empty($_POST["newsletter"]);
        $birthday = $_POST["birth"];

		session_start();
        switch (get_captcha_status()) {
            case CAPTCHA_CODE_ERROR: $errors[] = "Captcha invalide."; break;
            case CAPTCHA_CODE_FALSE: $errors[] = "Merci de remplir correctement le captcha."; break;
        }
		session_destroy();

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Format d'e-mail invalide.";
        }
        if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/', $username)) {
            $errors[] = "Le pseudo ne peut contenir que des minuscules, majuscules, chiffres ou un \"_\" avec une longueur maximale de 20 caractères.";
        }
        if (strlen($password) < 8 || strlen($password) > 60) {
            $errors[] = "Le mots de passe doit contenir au minimum 8 caractères et au maximum 60 caractères";
        }
        if ($password !== $password_v) {
            $errors[] = "Les mots de passes ne correspondent pas !";
        }
        $birthdayExploded = explode("-", $birthday);

        if( count($birthdayExploded)!=3 || !checkdate($birthdayExploded[1], $birthdayExploded[2], $birthdayExploded[0]) ){
            $errors[] = "Date de naissance incorrecte.";
        }else{
            $age = (time() - strtotime($birthday))/60/60/24/365.25;
            if($age<13 || $age>100){
                $errors[] = "Date de naissance hors borne.";
            }
        }

        $rq_select = getDB()->get_pdo()->prepare("SELECT email, username FROM " . DB_PREFIX.TABLE_USER. " WHERE email=:email OR username=:username LIMIT 2");
        $rq_select->execute(["email" => $email, "username" => $username]);
        foreach ($rq_select->fetchAll(PDO::FETCH_ASSOC) as $user) {
            if ($user["email"] === $email) {
                $errors[] = "Ce mail est deja reliée à un compte.";
            }
            if ($user["username"] === $username) {
                $errors[] = "Ce nom d'utilisateur est deja reliée à un compte.";
            }
        }
        if (count($errors) === 0) {
            getDB()->insert(TABLE_USER, [
                "email" => $email,
                "username" => $username,
                "password" => password_hash($password, PASSWORD_DEFAULT),
                "birthday" => $birthday,
                "status" => $newsLetter ? STATUS_EMAIL_NEWS_LETTER : STATUS_NOTHING
            ]);
            $user = get_log_user();
            $user->login($email, $password);
            success([
                "user_id" => $user->getId(),
                "mail_token" => $user->get_verification_token()
            ]);
        }
    }
    bad_request($errors);
}
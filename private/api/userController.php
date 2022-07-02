<?php

function invokeUser($method, $function, $query) {
    if ($method === "GET") {
        if (count($function) === 1) {
            if ($function[0] === 'all') {
                _admin_fetch_user($query);
            }
            _get_user($function[0], $query);
        }
    } elseif ($method === "POST") {
        if (count($function) === 1) {
            switch ($function[0]) {
                case 'permission': _admin_change_permission(); break;
                case 'delete': _user_delete_self();
                default: break;
            }
        } elseif (count($function) === 2 && $function[0] === "edit") {
			switch ($function[1]) {
				case 'email': _change_user_email(); break;
				case 'username': _change_user_pseudo(); break;
				case 'birthday': _change_user_birthday(); break;
				case 'password': _change_user_password(); break;
			}
        }
    } else {
        bad_method();
    }
}

/**
 * fetch public user
 * permission ALL
 * @version 1.0.0
 * @api GET /user/all
 * @author Alice.B
 * @example limit, offset, order, reverse
 */
function _admin_fetch_user($query) {
    admin_fetch(TABLE_USER, ['id', 'username', 'email', 'birthday', 'status', 'permission', 'date_updated', 'date_inserted'], $query, 'id', ['username', 'email', 'permission']);
}

/**
 * fetch public user
 * permission ALL
 * @version 1.0.0
 * @api GET /user/{userID}
 * @param $userid => id OF user or ME for self
 * @author Alice.B
 */
function _get_user($userid, $query) {
    if (strlen($userid) === 0 || strlen($userid) > 32) {
        bad_request('Invalid user');
    }
    if ($userid === 'me') {
        $user = get_log_user();
        if (!$user->is_connected()) {
            unauthorized();
        }
    } else {
        $user = new User($userid);
    }
    if (!$user->is_connected() || $user->is_delete()) {
        bad_request('Invalid user');
    }
    $data = $user->getAPIData($userid === 'me');

    if (isset($query['details']) && $query['details'] === '1') {
        $where_project = ['author' => $user->getId()];
        if ($userid !== 'me' && get_log_user()->get_permission_level() < PERMISSION_MODERATOR) {
            $where_project['status'] = PROJECT_STATUS_PUBLISHED;
        }
        $data["project"] = getDB()->select(TABLE_PROJECT, ['id', 'author', 'picture', 'title', 'description'],$where_project, 5, 'date_inserted DESC');
        $data['like'] = getDB()->select_set_settings('SELECT project, volume, picture, author, title, status, like_count, dislike_count, read_count  FROM PAE_VOLUME_READING AS R LEFT JOIN PAE_VOLUME PV on R.fk_project = PV.project and R.fk_volume = PV.volume', ['user_id' => $user->getId()], 5, 'R.date_inserted DESC');
    }

    success($data);
}

function __check_password_for_edit() {
	$user = get_log_user();
	if (!$user->is_connected()) unauthorized();
	$current_password = $_POST['password-c']??null;
	if ($current_password === null || !$user->is_valid_password($current_password)) bad_request('Mot de passe actuelle invalide');
}

function _change_user_email() {

	__check_password_for_edit();
	$user = get_log_user();
	$email = $_POST['email']??null;
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) bad_request("Format d'e-mail invalide.");

	$verification_token = createMD5Token();
	$token_2 = createMD5Token();
	// delete old verification
	getDB()->delete(TABLE_VERIFICATION, ["user_id" => $user->getId(), 'type' => VERIFICATION_TYPE_EMAIL_CHANGE]);
	getDB()->insert(TABLE_VERIFICATION, ["id" => $verification_token, "user_id" => $user->getId(), 'type' => VERIFICATION_TYPE_EMAIL_CHANGE, "token" => $token_2, "value" => $email]);
	send_password_change_verification($token_2, $user->getId(), $user->getEmail(), $user->getUsername());
	success();
}

function _change_user_pseudo() {
	__check_password_for_edit();
	$pseudo = $_POST['username']??null;
	if ($pseudo === null || !preg_match('/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/', $pseudo))
		bad_request("Le pseudo ne peut contenir que des minuscules, majuscules, chiffres ou un \"_\" avec une longueur maximale de 20 caractères.");

    if (getDB()->select(TABLE_USER, ['id'], ['username' => $pseudo], 1)) bad_request("Ce nom d'utilisateur est deja reliée à un compte.");

	getDB()->update(TABLE_USER, ['username' => $pseudo], ['id' => get_log_user()->getId()]);
	success();
}

function _change_user_birthday() {
	__check_password_for_edit();
	$birthday = $_POST['birthday']??null;

	$birthdayExploded = explode("-", $birthday);
	if( count($birthdayExploded)!=3 || !checkdate($birthdayExploded[1], $birthdayExploded[2], $birthdayExploded[0]) ){
		bad_request("Date de naissance incorrecte.");
	}else{
		$age = (time() - strtotime($birthday))/60/60/24/365.25;
		if($age<13 || $age>100){
			bad_request("Date de naissance hors borne.");
		}
	}

	getDB()->update(TABLE_USER, ['birthday' => $birthday], ['id' => get_log_user()->getId()]);
	success();
}

function _change_user_password() {
	__check_password_for_edit();
	$user = get_log_user();
	$new_password = $_POST['password']??null;
	$new_password_verification = $_POST['password-v']??null;

	if ($new_password === null || $new_password_verification === null) bad_request('Formulaire incomplet');
	if ($new_password !== $new_password_verification) bad_request('Les mots de passes ne coresponde pas');
	if (strlen($new_password) < 8 || strlen($new_password) > 60) bad_request("Le mots de passe doit contenir au minimum 8 caractères et au maximum 60 caractères");

	$verification_token = createMD5Token();
	$token_2 = createMD5Token();
	// delete old verification
	getDB()->delete(TABLE_VERIFICATION, ["user_id" => $user->getId(), 'type' => VERIFICATION_TYPE_PASSWORD_CHANGE]);
	getDB()->insert(TABLE_VERIFICATION, ["id" => $verification_token, "user_id" => $user->getId(), 'type' => VERIFICATION_TYPE_PASSWORD_CHANGE, "token" => $token_2, "value" => password_hash($new_password, PASSWORD_DEFAULT)]);
	send_password_change_verification($token_2, $user->getId(), $user->getEmail(), $user->getUsername());
	success();
}

function _user_delete_self() {
    __check_password_for_edit();
    $user = get_log_user();
    $verification_token = createMD5Token();
    $token_2 = createMD5Token();
    // delete old verification
    getDB()->delete(TABLE_VERIFICATION, ["user_id" => $user->getId(), 'type' => VERIFICATION_TYPE_DELETE]);
    getDB()->insert(TABLE_VERIFICATION, ["id" => $verification_token, "user_id" => $user->getId(), 'type' => VERIFICATION_TYPE_DELETE, "token" => $token_2]);
    send_email_delete_account($token_2, $user->getId(), $user->getEmail(), $user->getUsername());
    success();
}

/**
 * change permission of a user
 * permission LEVEL >= MODERATOR
 * @version 1.0.0
 * @api POST /user/permission
 * @example  user => userID
 * @example permission => new permission [0-255]
 * @author Alice.B
 */
function _admin_change_permission() {
    if (!isConnected()) {
        unauthorized();
    }
    if (!is_moderator()) {
        forbidden();
    }

    $user = $_POST["user"]??null;
    $permission = $_POST["permission"]??null;

    // check
    if ($user === null || !is_numeric($permission) || $permission < 0 || $permission > 255) {
        bad_request($_POST);
    }
    $sendPerm = get_log_user()->get_permission_level();
    if ($permission >= $sendPerm && $sendPerm !== PERMISSION_ADMIN) {
        forbidden();
    }

    $userO = new User($user);
    if (!$userO->is_connected()) {
        bad_request('Invalid user');
    }
    if ($sendPerm <= $userO->get_permission_level() && $sendPerm !== PERMISSION_ADMIN) {
        forbidden();
    }
    if ($userO->set_permission($permission)) {
        success();
    } else {
        internal_error();
    }
}

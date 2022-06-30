<?php
require 'private/utils/functions.php';

if (!$method = strtoupper($_SERVER["REQUEST_METHOD"]) === "GET") {
    http_response_code(405);
    exit();
}

$token = $_GET["t"] ?? null;
$user = $_GET["user"] ?? null;
$deny = $_GET["deny"] ?? '0';

if ($token === null || $user === null) {
    http_response_code(400);
    exit();
}

$raw = getDB()->select(TABLE_VERIFICATION, ['id', 'type', 'value'], ['user_id' => $user, "token" => $token], 1);
if ($raw) {
	getDB()->delete(TABLE_VERIFICATION, ['user_id' => $user, "token" => $token]);
	switch (intval($raw['type'])) {
		case VERIFICATION_TYPE_EMAIL_CREATE:

			$status = getDB()->select(TABLE_USER, ['status'], ['id' => $user], 1);
			if ($status) {
				getDB()->update(TABLE_USER, ['status' => intval($status["status"]) | STATUS_EMAIL_VERIFIED], ['id' => $user]);
				header('Location: /auth/verification-success');
				exit();
			}
			break;
		case VERIFICATION_TYPE_PASSWORD_CHANGE:
			if ($deny !== '1') {
				$token = createMD5Token();
				getDB()->update(TABLE_USER, ['password' => $raw['value'], "token" => $this->token], ['id' => $user]);
			}
			header('Location: /auth/verification-success');
			exit();
			break;
		case VERIFICATION_TYPE_EMAIL_CHANGE:
			if ($deny !== '1') {
				$token = createMD5Token();
				getDB()->update(TABLE_USER, ['email' => $raw['value'], "token" => $this->token], ['id' => $user]);
			}
			header('Location: /auth/verification-success');
			exit();
			break;
	}
}

header('Location: /auth/verification-failed');
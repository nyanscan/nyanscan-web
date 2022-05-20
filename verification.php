<?php
require 'private/utils/functions.php';
require 'private/utils/const.php';

if (!$method = strtoupper($_SERVER["REQUEST_METHOD"]) === "GET") {
    http_response_code(405);
    exit();
}

$token = $_GET["t"] ?? null;
$user = $_GET["user"] ?? null;

if ($token === null || $user === null) {
    http_response_code(400);
    exit();
}

$raw = getDB()->select(TABLE_VERIFICATION, ['id'], ['user_id' => $user, "token" => $token], 1);
if ($raw) {
    getDB()->delete(TABLE_VERIFICATION, ['user_id' => $user, "token" => $token]);
    $status = getDB()->select(TABLE_USER, ['status'], ['id' => $user], 1);
    if ($status) {
        getDB()->update(TABLE_USER, ['status' => intval($status["status"]) | STATUS_EMAIL_VERIFIED], ['id' => $user]);
        header('Location: /auth/verification-success');
        exit();
    }
    exit();
}
header('Location: /auth/verification-failed');




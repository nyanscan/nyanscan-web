<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/forum.php');
require($_SERVER['DOCUMENT_ROOT'] . '/private/captchaUtils.php');

include __DIR__ . '/private/forumController.php';
include __DIR__ . '/private/authController.php';
include __DIR__ . '/private/userController.php';

function my_error_handler()
{
    $last_error = error_get_last();
    if ($last_error && $last_error['type'] == E_ERROR) {
        header("HTTP/1.1 500 Internal Server Error");
    }
}

header("Content-Type: application/json");

function bad_method()
{
    json_exit(405, "Method Not Allowed", "Only accept POST");
}

function bad_request($reason = "")
{
    json_exit(400, "Bad Request", $reason);
}

function unauthorized() {
    json_exit(401, "Unauthorized", "Une authentification est nécessaire pour accéder à la ressource.");
}

function success($data = []) {
    http_response_code(200);
    echo json_encode(["code" => 200, "data" => $data]);
    exit();
}

register_shutdown_function('my_error_handler');

$uri = explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$controller = $uri[3] ?? null;
$function = array_slice($uri, 4);
parse_str($_SERVER['QUERY_STRING'], $query);
$method = strtoupper($_SERVER["REQUEST_METHOD"]);

switch ($controller) {
    case 'forum':
        invokeForm($method, $function, $query);break;
    case 'auth':
        invokeAuth($method, $function, $query); break;
    case 'user':
        invokeUser($method, $function, $query); break;
    case 'captchaSettings':
        if ($method === 'GET' && count($function) === 0) _get_captcha_settings();
        break;
    default:
        break;

}


function _get_captcha_settings() {
    success([
        "width" => CAPTCHA_WIDTH,
        "height" => CAPTCHA_HEIGHT,
        "piece_size" => CAPTCHA_PIECE_SIZE,
        "cell_size" => CAPTCHA_CELL_SIZE,
        "number_piece" => CAPTCHA_NUMBER_PIECE,
    ]);
}

//print_r($uri);
//print_r($method);
//print_r($function);
//print_r($query);

//default 404 error
header("HTTP/1.1 404 Not Found");
exit();

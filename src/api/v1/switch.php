<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('strict-origin-when-cross-origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Max-Age: 300');

$method = strtoupper($_SERVER["REQUEST_METHOD"]);
if ($method === "OPTIONS") exit(200);

require(__DIR__ . '/../../../private/utils/forum.php');
require(__DIR__ . '/../../../private/utils/mailer.php');

function my_error_handler() {
    $last_error = error_get_last();
    if ($last_error && $last_error['type'] == E_ERROR) {
        header("HTTP/1.1 500 Internal Server Error");
    }
}

header("Content-Type: application/json");

function is_moderator() : bool {
    $user = get_log_user();
    return $user->is_connected() && $user->get_permission_level() >= PERMISSION_MODERATOR;
}

function is_admin() : bool {
    $user = get_log_user();
    return $user->is_connected() && $user->get_permission_level() >= PERMISSION_ADMIN;
}

function bad_method() {
    json_exit(405, "Method Not Allowed", "Only accept POST");
}

function bad_request($reason = "") {
    json_exit(400, "Bad Request", $reason);
}

function unauthorized($invalid_token = false) {
    json_exit(401, "Unauthorized",  $invalid_token ? "Invalid Authorization" : "Authentication is required to access ressources");
}

function forbidden() {
    json_exit(403, "Forbidden", "Forbidden");
}

function success($data = []) {
    http_response_code(200);
    echo json_encode(["code" => 200, "data" => $data]);
    exit();
}

function success204() {
    http_response_code(204);
    exit();
}

function internal_error() {
    json_exit(500, "Internal Server Error", "Internal Server Error");
}

function admin_fetch($table, $col, $query, $primary, $search_col=[]) {
    if (!isConnected()) {
        unauthorized();
    }
    if (!is_moderator()) {
        forbidden();
    }

    $limit = min(200, max(0, intval($query["limit"]??0)));
    $offset = max(0, intval($query["offset"]??0));

    $order = $query["order"]??null;
    $order_reverse = isset($query["reverse"]) && !$query["reverse"] == '0';

    $where = [];

    foreach ($search_col as $s) {
        if (isset($query[$s])) {
            $where[$s] = ['v' => $query[$s], "o" => " LIKE "];
        }
    }

    $order_v = null;

    if ($order) {
        if (in_array($order,$col)) {
            $order_v = $order . ' ' . ($order_reverse ? 'DESC' : 'ASC');
        }
    }
    $data = [];

    $data["element"] = getDB()->select($table, $col, $where, $limit, $order_v, $offset);
    $data["total_count"] = getDB()->count($table, $primary, $where);
    success($data);
}

register_shutdown_function('my_error_handler');

$uri = explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$controller = $uri[3] ?? null;
$function = array_slice($uri, 4);
parse_str($_SERVER['QUERY_STRING'], $query);



if ($controller === 'analytic') {
    $path = join('/', $function);
} else {
    $path = join('/', $uri);
}

if ($path) {
    $req = getDB()->get_pdo()->prepare('INSERT INTO PAE_LOG_ROUTE (root) VALUES (:path) ON DUPLICATE KEY UPDATE visited=visited+1');
    $req->execute(["path" => $path]);
    if ($controller === 'analytic') {
        success204();
    }
}

try {
    switch ($controller) {
        case 'forum':
            require __DIR__ . '/../../../private/api/forumController.php';
            invokeForm($method, $function, $query);break;
        case 'auth':
            require __DIR__ . '/../../../private/api/authController.php';
            invokeAuth($method, $function, $query); break;
        case 'user':
            require __DIR__ . '/../../../private/api/userController.php';
            invokeUser($method, $function, $query); break;
        case 'captchaSettings':
            require(__DIR__ . '/../../../private/captchaUtils.php');
            if ($method === 'GET' && count($function) === 0) _get_captcha_settings();
            break;
        case 'project':
            require __DIR__ . '/../../../private/api/projectController.php';
            invokeProject($method, $function, $query);
            break;
        case 'event':
            require __DIR__ . '/../../../private/api/eventController.php';
            invokeEvent($method, $function, $query);
            break;
        case 'admin':
            require __DIR__ . '/../../../private/api/adminController.php';
            invokeAdmin($method, $function, $query); break;
        case 'search':
            require __DIR__ . '/../../../private/api/searchController.php';
            invokeSearch($method, $function, $query); break;
        default:
            require __DIR__ . '/../../../private/api/otherController.php';
            invokeDefault($method, [$controller, ...$function], $query); break;
    }
} catch (Exception $e) {
    json_exit(500, "Internal Server Error", "Internal Server Error");
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


json_exit(404, 'Not found', 'invalid api request');
//header("HTTP/1.1 404 Not Found");

exit();
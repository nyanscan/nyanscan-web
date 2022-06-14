<?php

function invokeUser($method, $function, $query) {
    if ($method === "GET") {
        if (count($function) === 1) {
            if ($function[0] === 'all') {
                _admin_fetch_user($query);
            }
            _get_user($function[0]);
        }
    } elseif ($method === "POST") {
        if (count($function) === 1) {
            switch ($function[0]) {
                case 'permission': _admin_change_permission(); break;
                default: break;
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
    admin_fetch(TABLE_USER, ['id', 'username', 'email', 'birthday', 'status', 'permission', 'date_updated', 'date_inserted'], $query, 'id');
}

/**
 * fetch public user
 * permission ALL
 * @version 1.0.0
 * @api GET /user/{userID}
 * @param $userid => id OF user or ME for self
 * @author Alice.B
 */
function _get_user($userid) {
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
    if (!$user->is_connected()) {
        bad_request('Invalid user');
    }
    success($user->getAPIData($userid === 'me'));
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
        bad_request();
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
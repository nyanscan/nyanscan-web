<?php

function invokeUser($method, $function, $query)
{
    if (count($function) === 1) {
        _get_user($function[0]);
    }
}

function _get_user($userid) {
    if (strlen($userid) === 0 || strlen($userid) > 32) bad_request('Invalid user');
    if ($userid === 'me') {
        $user = get_log_user();
        if (!$user->is_connected()) unauthorized();
    } else {
        $user = new User($userid);
    }
    if (!$user->is_connected()) bad_request('Invalid user');
    success($user->getAPIData($userid === 'me'));
}

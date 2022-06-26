<?php

function invokeAdmin($method, $function, $query) {
    if (!is_moderator()) {
        forbidden();
    }

    if ($method === "GET") {
        if ($function[0] === "stats") _admin_stats();
        if ($function[0] === "log-root") _admin_log_root($query);
    }
}

function _admin_log_root($query) {
    admin_fetch(TABLE_LOG_ROOT, ['root', 'visited', 'last'], $query, 'root', ['root']);
}

function _admin_stats() {
    success([
        "project" => getDB()->count(TABLE_EVENT, "id"),
        "picture" => getDB()->count(TABLE_PICTURE, "id"),
        "user" => getDB()->count(TABLE_USER, "id"),
        "volume" => getDB()->count(TABLE_VOLUME, "data"),
        "log-root" => getDB()->count(TABLE_LOG_ROOT, "root")
    ]);
}
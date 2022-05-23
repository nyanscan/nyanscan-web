<?php
function invokeAdmin($method, $function, $query) {
    if (!is_moderator()) forbidden();

    if ($method === "GET") {
        if ($function[0] === "stats") _admin_stats();
    }
}

function _admin_stats() {

    success([
        "project" => getDB()->count(TABLE_PROJECT, "id"),
        "picture" => getDB()->count(TABLE_PICTURE, "id"),
        "user" => getDB()->count(TABLE_USER, "id"),
        "volume" => getDB()->count(TABLE_VOLUME, "data")
    ]);

}


<?php

function invokeSearch($method, $function, $query) {
    if ($method === "GET") {
        if (count($function) === 0) {
            global_search($query);
        }
    } else {
        bad_method();
    }
}

function global_search($query) {

    $data = ["user" => [], "project" => []];

    $search = $query["v"]??null;
    $short = isset($query["short"]) && $query["short"] === '1';

    if (!$search) {
        success($data);
    }

    if ($search[0] === '#') {
        $data["project"] = project_search(substr($search,1), $short);
    } elseif ($search[0] === '@') {
        $data["user"] = user_search(substr($search,1), $short);
    } elseif (!$short && substr($search, 0, 7) === 'author:') {
        $data['project'] = projet_search_by_author(substr($search, 7));
    } elseif (!$short && substr($search, 0, 7) === 'likeby:') {
        $data['volume'] = project_like_by_user(substr($search, 7));
    } else {
        $data["user"] = user_search($search, $short);
        $data["project"] = project_search($search, $short);
    }
    success($data);
}

function user_search($v, $short): array {
    $req = getDB()->get_pdo()->prepare('SELECT id, username FROM PAE_USER WHERE username LIKE :username ORDER BY LOCATE(:username_short, username) LIMIT ' . ($short ? '5' : '50'));
    $req->execute(["username" => '%' . $v . '%', "username_short" => $v]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}

function project_search($v, $short): array {
    $req = getDB()->get_pdo()->prepare('SELECT id, title'. ($short ? '' : ', picture') .' FROM PAE_PROJECT WHERE title LIKE :title ORDER BY LOCATE(:title_short, title) LIMIT ' . ($short ? '5' : '50'));
    $req->execute(["title" => '%' . $v . '%', "title_short" => $v]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
function projet_search_by_author($v): array {
    if ($v === 'me' && get_log_user()->is_connected()) $v = get_log_user()->getId();
    return getDB()->select(TABLE_PROJECT, ['id', 'title', 'picture'], ['author' => $v]);
}

function project_like_by_user($v): array {
    if ($v === 'me' && get_log_user()->is_connected()) $v = get_log_user()->getId();
    return getDB()->select_set_settings("SELECT PV.project, PV.volume, title, picture FROM PAE_VOLUME_READING R LEFT JOIN PAE_VOLUME PV on R.fk_project = PV.project and R.fk_volume = PV.volume", ['user_id' => $v, 'is_negative' => '0']);
}
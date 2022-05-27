<?php

function invokeSearch($method, $function, $query) {

    if ($method === "GET") {
        if (count($function) === 0) global_search($query);
    } else bad_method();

}



function global_search($query) {

    $data = ["user" => [], "project" => []];

    $search = $query["v"]??null;
    $short = isset($query["short"]) && $query["short"] === '1';

    if (!$search) success($data);

    if ($search[0] === '#') {
        $data["project"] = project_search(substr($search,1), $search);
    } elseif ($search[0] === '@') {
        $data["user"] = user_search(substr($search,1), $search);
    } else {
        $data["user"] = user_search($search, $search);
        $data["project"] = project_search($search, $search);
    }
    success($data);
}

function user_search($v, $short): array {
    $req = getDB()->get_pdo()->prepare('SELECT id, username FROM PAE_USER WHERE username LIKE :username ORDER BY LOCATE(:username_short, username) LIMIT ' . ($short ? '5' : '20'));
    $req->execute(["username" => '%' . $v . '%', "username_short" => $v]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}

function project_search($v, $short): array {
    $req = getDB()->get_pdo()->prepare('SELECT id, title FROM PAE_PROJECT WHERE title LIKE :title ORDER BY LOCATE(:title_short, title) LIMIT ' . ($short ? '5' : '20'));
    $req->execute(["title" => '%' . $v . '%', "title_short" => $v]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
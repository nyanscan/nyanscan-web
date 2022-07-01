<?php

/**
 * @throws Exception
 */
function invokeEvent($method, $function, $query) {
    if ($method === "POST") {
        if ($function[0] === 'create') {
            _new_event();
        }
        if ($function[0] === 'validation') {
            _change_status_event();
        }
    } elseif ($method === "GET") {
        if ($function[0] === 'user' && count($function) === 2) {
            _fetch_user_events($function[1]);
        } elseif ($function[0] === 'all') {
            _admin_fetch_events($query);
        } /*elseif ($function[0] === 'index') {
            fetch_index();
        } */ elseif (count($function) === 1) {
            _fetch_event($function[0]);
        }
    } elseif ($method === "DELETE") {
        if (count($function) === 2) {
            _delete_event($function[0], $function[1]);
        }
    } else {
        bad_method();
    }
}

/*function fetch_index() {
    $data = [];
    // todo: change
    $data["last"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'title'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');
    $data["fame"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'title'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');
    $data["love"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'title'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');

    shuffle($data["fame"]);
    shuffle($data["love"]);

    success($data);
}*/

/**
 * @throws Exception
 */
function _new_event() {
    $user = get_log_user();
    if (!$user->is_connected()) {
        unauthorized();
    }

    if (getDB()->count(TABLE_EVENT, 'id', ['author' => $user->getId(), 'status' => EVENT_STATUS_WAIT_VERIFICATION]) > 1) {
        bad_request("l'utilisateur a deja un évènement en attente de vérification.");
    }

    $title = $_POST["title"] ?? null;
    $format = $_POST["format"] ?? null;
    $direction = $_POST["direction"] ?? null;
    $description = $_POST["description"] ?? null;

    $error = [];

    if ($title === null || strlen($title) < 1 || strlen($title) > 100) {
        $error[] = "Titre invalide.";
    }
    if ($format === null || ($format != '1' && $format != '2')) {
        $error[] = "Format de publication invalide.";
    }
    if ($direction === null || ($direction != '1' && $direction != '2')) {
        $error[] = "Sens de lecture invalide.";
    }
    if ($description === null || strlen($title) < 1 || strlen($title) > 2000) {
        $error[] = "Description trop longue (2000 max.) ou inexistante.";
    }

    if (empty($error)) {
        $img = download_image_from_post("picture", [PICTURE_FORMAT_JPG, PICTURE_FORMAT_PNG, PICTURE_FORMAT_WEBP], 1e6);
        if (is_numeric($img)) {
            switch ($img) {
                case -1:
                    $error[] = "Pas de vignette";
                    break;
                case -2:
                    $error[] = "Vignette trop lourde max. 500Ko";
                    break;
                default:
                    json_exit(500, "Uploading error", "unknown");
                    break;
            }
        } else {
            $img->resize(720, 576);
            $img->set_author($user->getId());
            $img->set_title("Image pour l'évènement' " . substr($title, 0, 24) . '...');
            $img->add_logo();
            $img->save();
            getDB()->insert(TABLE_EVENT, [
                "author" => $user->getId(),
                "picture" => $img->get_id(),
                "title" => $title,
                "description" => $description,
                "reading_direction" => $direction,
                "format" => $format,
                "status" => EVENT_STATUS_WAIT_VERIFICATION
            ]);
        }
    }
    if (count($error) > 0) {
        bad_request($error);
    }
    success();
}

function _fetch_user_events($userId) {
    $user = get_log_user();
    // self
    if ($userId === 'me' || ($user->is_connected() && $user->getId() === $userId)) {
        success(getDB()->select(TABLE_EVENT,
            ["id", "author", "picture", "title", "description", "format", "status", "date_inserted"],
            ["author" => $user->getId()],
            0, "date_inserted DESC"));
    } else {
        success(getDB()->select(
            TABLE_EVENT,
            ["id", "author", "picture", "title", "description", "format", "date_inserted"],
            ["author" => $userId, "status" => EVENT_STATUS_PUBLISHED],
            0, "date_inserted DESC"));
    }
}

function _fetch_event($id) {
    $project = getDB()->select(TABLE_EVENT, ["id", "author", "picture", "title", "description", "format", "status", "date_inserted"],
        ["id" => $id], 1);
    if (!$project) {
        bad_method();
    }

    if ($project["status"] != EVENT_STATUS_PUBLISHED) {
        $user = get_log_user();
        if ( !$user->is_connected() || ($user->get_permission_level() < PERMISSION_MODERATOR && $user->getId() !== $project["author"])) {
            forbidden();
        }
    }
    success($project);
}

function _admin_fetch_events($query) {
    admin_fetch(TABLE_EVENT, ['id', 'author', 'picture', 'title', 'description', 'reading_direction', 'format', 'status', 'date_inserted'], $query, 'id');
}

function _change_status_event() {
    if (!is_moderator()) {
        forbidden();
    }
    $status = $_POST["status"]??null;
    $projectID = $_POST["project"]??null;
    $reason = $_POST["reason"]??null;
    if ($reason === null) {
        $reason = "";
    }

    if (!is_numeric($status) || intval($status) < 0 || $status > EVENT_STATUS_PUBLISHED) {
        bad_request("wrong status");
    }

    $project = getDB()->select(TABLE_EVENT, ['id', 'author', 'title'], ["id" => $projectID], 1);
    if (!$project) {
        bad_request("wrong project");
    }
    if (strlen($reason) > 255) {
        bad_request("La raison ne doit pas dépasser les 255 caractères.");
    }

    getDB()->update(TABLE_EVENT, ["status" => $status], ["id" => $projectID]);

    // send mail
    $text_status = "";
    switch ($status) {
        case PROJECT_STATUS_WAIT_VERIFICATION: $text_status = "Attente de vérification"; break;
        case PROJECT_STATUS_REJECT: $text_status = "Rejeté"; break;
        case PROJECT_STATUS_ACCEPTED_NO_CONTENT: $text_status = "Accepté en attente de contenue"; break;
        case EVENT_STATUS_PUBLISHED: $text_status = "Publié"; break;
    }

    if ($project["author"]) {
        $user = getDB()->select(TABLE_USER, ['username', 'email'], ['id' => $project["author"]], 1);
        if ($user) {
            send_project_status_change_mail($text_status, $project['title'], $user["email"], $user["username"]);
        }
    }
    success();
}

//TODO to change
function _delete_event($project, $tome) {
    if (!is_admin()) {
        unauthorized();
    }

    $volume = getDB()->select(TABLE_VOLUME, ["data"], ["project" => $project, "volume" => $tome], 1);
    if ($volume) {
        getDB()->delete(TABLE_VOLUME, ["project" => $project, "volume" => $tome]);
        $json_path = VOLUME_PATH . 'header_data/' . $volume["data"] . '.json';
        if (!file_exists($json_path)) {
            return;
        }
        $json = file_get_contents($json_path);
        $data = json_decode($json, true);

        foreach ($data["pages"] as $page) {
            $dir = VOLUME_PATH . substr($page, 0, 3);
            $files =  '/' . $dir . substr($page, 3) . '.jpg';
            if (file_exists($files)) {
                unlink($files);
            }
            if (file_exists($dir) && is_dir_empty($dir)) {
                rmdir($dir);
            }
        }
        unlink($json_path);
        success();
    } else {
        bad_request("no volume " . $volume . " for project " . $project);
    }
}
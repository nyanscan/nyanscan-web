<?php

function invokeProject($method, $function, $query)
{
    if ($method === "POST") {
        if ($function[0] === 'create') _new_project();
        if ($function[0] === 'validation') _change_status_project();
        if ($function[0] === 'volume') _new_volume();
    } elseif ($method === "GET") {
        if ($function[0] === 'user' && count($function) === 2)
            _fetch_user_projects($function[1]);
        elseif ($function[0] === 'all') _admin_fetch_projects($query);
        elseif ($function[0] === 'volumes-all') _admin_fetch_volume($query);
        elseif ($function[0] === 'index') fetch_index();
        elseif (count($function) === 2 && $function[1] === 'volumes') _fetch_project_with_volumes($function[0]);
        elseif (count($function) === 1) _fetch_project($function[0]);
        elseif (count($function) === 2) _fetch_volume($function[0], $function[1]);
    } elseif ($method === "DELETE") {
        if (count($function) === 2) _delete_volume($function[0], $function[1]);
    } else bad_method();
}

function fetch_index() {
    $data = [];
    // todo: change
    $data["last"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'title'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');
    $data["fame"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'title'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');
    $data["love"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'title'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');

    shuffle($data["fame"]);
    shuffle($data["love"]);

    success($data);

}

function _new_project()
{
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();

    if (getDB()->count(TABLE_PROJECT, 'id', ['author' => $user->getId(), 'status' => PROJECT_STATUS_WAIT_VERIFICATION]) > 1) {
        bad_request("l'utilisateur à dèja un projet en attente de vérification");
    }

    $title = $_POST["title"] ?? null;
    $format = $_POST["format"] ?? null;
    $direction = $_POST["direction"] ?? null;
    $description = $_POST["description"] ?? null;

    $error = [];

    if ($title === null || strlen($title) < 1 || strlen($title) > 100) $error[] = "Titre invalide !";
    if ($format === null || ($format != '1' && $format != '2')) $error[] = "Format de publication inavlide !";
    if ($direction === null || ($direction != '1' && $direction != '2')) $error[] = "Sens de lecture inavlide !";
    if ($description === null || strlen($title) < 1 || strlen($title) > 2000) $error[] = "Description trop longue (2000) ou inexistante !";

    if (empty($error)) {
        $img = download_image_from_post("picture", [PICTURE_FORMAT_JPG, PICTURE_FORMAT_PNG, PICTURE_FORMAT_WEBP], 1e6);
        if (is_numeric($img)) {
            switch ($img) {
                case -1:
                    $error[] = "Pas de vignette";
                    break;
                case -2:
                    $error[] = "Vignette trop lourde max 500Ko";
                    break;
                default:
                    json_exit(500, "Uploading error", "unknow");
                    break;
            }
        } else {
            $img->resize(444, 630);
            $img->set_author($user->getId());
            $img->set_title("Image pour le projet " . substr($title, 0, 24) . '...');
            $img->add_logo();
            $img->save();
            getDB()->insert(TABLE_PROJECT, [
                "author" => $user->getId(),
                "picture" => $img->get_id(),
                "title" => $title,
                "description" => $description,
                "reading_direction" => $direction,
                "format" => $format,
                "status" => PROJECT_STATUS_WAIT_VERIFICATION
            ]);
        }
    }
    if (count($error) > 0) bad_request($error);
    success();
}

function _fetch_user_projects($userId)
{
    $user = get_log_user();
    // self
    if ($userId === 'me' || ($user->is_connected() && $user->getId() === $userId)) {
        success(getDB()->select(TABLE_PROJECT,
            ["id", "author", "picture", "title", "description", "format", "status", "date_inserted"],
            ["author" => $user->getId()],
            0, "date_inserted DESC"));
    } else {
        success(getDB()->select(
            TABLE_PROJECT,
            ["id", "author", "picture", "title", "description", "format", "date_inserted"],
            ["author" => $userId, "status" => PROJECT_STATUS_PUBLISHED],
            0, "date_inserted DESC"));
    }
}

function _fetch_project($id) {
    $project = getDB()->select(TABLE_PROJECT, ["id", "author", "picture", "title", "description", "format", "status", "date_inserted"],
        ["id" => $id], 1);
    if (!$project) bad_method();

    if ($project["status"] != PROJECT_STATUS_PUBLISHED) {
        $user = get_log_user();
        if ( !$user->is_connected() || ($user->get_permission_level() < PERMISSION_MODERATOR && $user->getId() !== $project["author"])) forbidden();
    }

    success($project);

}

function _fetch_project_with_volumes($id) {
    $project = getDB()->select(TABLE_PROJECT, ["id", "author", "picture", "title", "description", "format", "status", "date_inserted"],
        ["id" => $id], 1);
    if (!$project) bad_method();


    $where = ["project" => $id];
    if ($project["status"] != PROJECT_STATUS_PUBLISHED) {
        $user = get_log_user();
        if ( !$user->is_connected() || ($user->get_permission_level() < PERMISSION_MODERATOR && $user->getId() !== $project["author"])) forbidden();
    } else {
//        $where["status"] = PROJECT_STATUS_PUBLISHED;
    }

    $volumes = getDB()->select(TABLE_VOLUME, ['volume', 'picture', 'title', 'page_count', 'status'], $where);
    $project["volumes"] = $volumes;

    success($project);
}

function _fetch_volume($project, $tome) {
    $req = getDB()->get_pdo()->prepare("SELECT     project,
    volume,
    P.author as author,
    V.picture as volume_picture,
    P.picture as project_picture,
    data,
    P.title as project_title,
    V.title as volume_title,
    page_count,
    P.status as project_status,
    V.status as volume_status,
    V.date_inserted as volume_date_inserted,
    description,
    reading_direction,
    format FROM PAE_VOLUME AS V LEFT JOIN PAE_PROJECT P ON V.project = P.id WHERE V.project=:project AND V.volume=:volume LIMIT 1");
    $req->execute(["project" => $project, "volume" => $tome]);
    $data = $req->fetch(PDO::FETCH_ASSOC);

    if ($data["project_status"] != PROJECT_STATUS_PUBLISHED || $data["volume_picture"] != PROJECT_STATUS_PUBLISHED){
        $user = get_log_user();
        if ( !$user->is_connected() || ($user->get_permission_level() < PERMISSION_MODERATOR && $user->getId() !== $data["author"])) forbidden();
    }

    $json = file_get_contents(VOLUME_PATH . 'header_data/' . $data["data"] . '.json');
    $data["data"] = json_decode($json, true);

    success($data);
}

function _admin_fetch_projects($query) {
    admin_fetch(TABLE_PROJECT, ['id', 'author', 'picture', 'title', 'description', 'reading_direction', 'format', 'status', 'date_inserted'], $query, 'id');
}

function _admin_fetch_volume($query) {
    admin_fetch(TABLE_VOLUME, ['project', 'volume', 'picture', 'data', 'author', 'title', 'page_count', 'status', 'date_inserted'], $query, 'data');
}

function _change_status_project() {
    if (!is_moderator()) forbidden();
    $status = $_POST["status"]??null;
    $projectID = $_POST["project"]??null;
    $reason = $_POST["reason"]??null;
    if ($reason === null) $reason = "";

    if (!is_numeric($status) || intval($status) < 0 || $status > PROJECT_STATUS_PUBLISHED) {
        bad_request("wrong status");
    }

    $project = getDB()->select(TABLE_PROJECT, ['id', 'author', 'title'], ["id" => $projectID], 1);
    if (!$project) bad_request("wrong project");
    if (strlen($reason) > 255) bad_request("La raison ne dois pas deepasser les 255 caractéres");

    getDB()->update(TABLE_PROJECT, ["status" => $status], ["id" => $projectID]);

    // send mail
    $text_status = "";
    switch ($status) {
        case PROJECT_STATUS_WAIT_VERIFICATION: $text_status = "Attente de vérification"; break;
        case PROJECT_STATUS_REJECT: $text_status = "Rejeté"; break;
        case PROJECT_STATUS_ACCEPTED_NO_CONTENT: $text_status = "Accepté en attente de contenue"; break;
        case PROJECT_STATUS_PUBLISHED: $text_status = "Publié"; break;
    }

    if ($project["author"]) {
        $user = getDB()->select(TABLE_USER, ['username', 'email'], ['id' => $project["author"]], 1);
        if ($user) send_project_status_change_mail($text_status, $project['title'], $user["email"], $user["username"]);
    }
    success();
}

function _delete_volume($project, $tome) {
    if (!is_admin()) unauthorized();

    $volume = getDB()->select(TABLE_VOLUME, ["data"], ["project" => $project, "volume" => $tome], 1);
    if ($volume) {

        getDB()->delete(TABLE_VOLUME, ["project" => $project, "volume" => $tome]);
        $json_path = VOLUME_PATH . 'header_data/' . $volume["data"] . '.json';
        if (!file_exists($json_path)) return;
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
    } else bad_request("no volume " . $volume . " for project " . $project);
}

function _new_volume() {
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();

    print_r($_POST);
    print_r($_FILES);

    $title = $_POST["title"] ?? null;
    $volume = $_POST["volume"] ?? null;
    $project = $_POST["project"] ?? null;
//    $page_count = $_POST["page_count"] ?? null;

    $error = [];

    if ($title === null || strlen($title) < 1 || strlen($title) > 100) $error[] = "Titre invalide !";
    if (!is_numeric($volume) || $volume < 0) $error[] = "Le volume n'est pas valide";
//    if (!is_numeric($page_count) || $page_count < 0) $error[] = "Le nombre de page n'est pas valide";
    if (!isset($_FILES["picture"])) $error[] = "Une vignnette est requise";
    if (!isset($_FILES["pdf"])) $error[] = "Un fichier pdf est requis";

    $data_project = (!isset($volume) || !is_numeric($volume)) ? null : getDB()->select(TABLE_PROJECT, ['id', 'author', 'status'], ['id' => $project], 1);

    if (!$data_project) $error[] = "Le project est invalide";

    if (count($error) === 0) {
        if ($user->get_permission_level() < PERMISSION_MODERATOR && ['author'] != $user->getId()) unauthorized();
        if ($data_project["status"] != PROJECT_STATUS_ACCEPTED_NO_CONTENT  && $data_project["status"] != PROJECT_STATUS_PUBLISHED) $error[] = "Le project n'est pas validé";
        if (getDB()->select(TABLE_VOLUME, ['project'], ['project' => $data_project['id'], 'volume' => $volume], 1)) $error[] = "Ce volume existe dèja";
    }
    if (count($error) > 0) bad_request($error);
    $doc = [];
    $img = download_image_from_post("picture", [PICTURE_FORMAT_JPG, PICTURE_FORMAT_PNG, PICTURE_FORMAT_WEBP], 1e6);
    if (is_numeric($img)) {
        switch ($img) {
            case -1:
                $error[] = "Pas de vignette";
                break;
            case -2:
                $error[] = "Vignette trop lourde max 500Ko";
                break;
            case -3:
                json_exit(500, "Uploading error", "unknown");
                break;
            default:
                $error[] = "Format Vignette invalide";
        }
    } else {
        $img->resize(444, 630);
        $img->set_author($user->getId());
        $img->set_title("Image pour le volume " . substr($title, 0, 24) . '...');
        $img->add_logo();

        $doc = download_volume_from_post('pdf');
        if (is_numeric($doc)) {
            switch ($doc) {
                case -1:
                    $error[] = "Pas de pdf";
                    break;
                case -2:
                    $error[] = "pdf trop lourde max 500Mo";
                    break;
                case -3:
                    json_exit(500, "Uploading error", "unknown");
                    break;
                default:
                    $error[] = "Fichier pdf invalide";
            }
        } else {
            $img->save();
        }
    }

    if (count($error) > 0) bad_request($error);

    $data_uuid = uniqidReal(24);

    $json = json_encode($doc);

    if (!file_put_contents(VOLUME_PATH . 'header_data/' . $data_uuid . '.json' , $json)) json_error(500, "save_data_error", "unknown");

    $v_data = [
        "project" => $project,
        "volume" => $volume,
        "picture" => $img->get_id(),
        "data" => $data_uuid,
        "author" => $user->getId(),
        "title" => $title,
        "page_count" => $doc["count"],
        "status" => PROJECT_STATUS_WAIT_VERIFICATION
    ];

    getDB()->insert(TABLE_VOLUME, $v_data);
    success();


}
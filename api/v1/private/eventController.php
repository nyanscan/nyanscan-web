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
        if ($function[0] === 'edit') {
            _edit_event();
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
    $data["last"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'name'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');
    $data["fame"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'name'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');
    $data["love"] = getDB()->select(TABLE_PROJECT, ['id', 'picture', 'name'], ["status" => PROJECT_STATUS_PUBLISHED], 4, 'date_inserted DESC');

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

    $name = $_POST["name"] ?? null;
    $startDate = $_POST["start_date"] ?? null;
    $endDate = $_POST["end_date"] ?? null;
    $maxUser = $_POST["max_user"] ?? null;
    $isDistance = $_POST["is_distance"] ?? null;
    $address = $_POST["address"] ?? null;
    $contact = $_POST["contact"] ?? null;
    $contactPhone = $_POST["contact_phone"] ?? null;
    $link = $_POST["link"] ?? null;
    $description = $_POST["description"] ?? null;

    $error = [];

    if ($name === null || strlen($name) < 1 || strlen($name) > 100) {
        $error[] = "Titre invalide.";
    }
    //TODO to implement correctly
    $startDateExploded = explode("-", $startDate);
    if( count($startDateExploded)!=3 || !checkdate($startDateExploded[1], $startDateExploded[2], $startDateExploded[0]) ){
        $error[] = "Date de début incorrecte.";
    }else{
        $correctStart = (time() - strtotime($startDate))/60/60/24/365.25;
        if($correctStart<1){
            $error[] = "Vous ne pouvez pas créer d'évènement commençant aujourd'hui ou avant.";
        }
    }
    //TODO to implement correctly
    $endDateExploded = explode("-", $endDate);
    if( count($endDateExploded)!=3 || !checkdate($endDateExploded[1], $endDateExploded[2], $endDateExploded[0]) ){
        $error[] = "Date de fin incorrecte.";
    }else{
        $correctEnd = (time() - strtotime($endDate))/60/60/24/365.25;
        if($correctEnd<13){
            $error[] = "Date de naissance hors borne.";
        }
    }
    if ($maxUser === null || ($maxUser === 0)) {
        $error[] = "Nombre max. de participants invalide.";
    }
    //TODO to implement correctly
    if ($isDistance === null || ($isDistance != '1' && $isDistance != '2')) {
        $error[] = "Préférence de présence invalide.";
    }
    //TODO to implement correctly
    if ($address === null) {
        $error[] = "Adresse invalide.";
    }
    if ($contact === null) {
        $error[] = "Nom du contact invalide.";
    }
    if ($contactPhone === null) {
        $error[] = "Numéro du contact invalide.";
    }
    //TODO to implement correctly
    if ($link === null) {
        $error[] = "Lien invalide.";
    }
    if ($description === null || strlen($name) < 1 || strlen($name) > 2000) {
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
            $img->set_title("Image pour l'évènement' " . substr($name, 0, 24) . '...');
            $img->add_logo();
            $img->save();
            getDB()->insert(TABLE_EVENT, [
                "author" => $user->getId(),
                "picture" => $img->get_id(),
                "name" => $name,
                "description" => $description,
                "max_user" => $maxUser,
                "start_date" => $startDate,
                "end_date" => $endDate,
                "is_distance" => $isDistance,
                "address" => $address,
                "contact" => $contact,
                "contact_phone" => $contactPhone,
                "link" => $link,
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
            ["id", "author", "picture", "name", "description", "start_date", "end_date", "max_user", "is_distance", "address", "contact", "contact_phone" , "link", "status", "date_inserted"],
            ["author" => $user->getId()],
            0, "date_inserted DESC"));
    } else {
        success(getDB()->select(
            TABLE_EVENT,
            ["id", "author", "picture", "name", "description", "start_date", "end_date", "max_user", "is_distance", "address", "contact", "contact_phone" , "link", "status", "date_inserted"],
            ["author" => $userId, "status" => EVENT_STATUS_PUBLISHED],
            0, "date_inserted DESC"));
    }
}

function _fetch_event($id) {
    $event = getDB()->select(TABLE_EVENT, ["id", "author", "picture", "name", "description", "start_date", "end_date", "max_user", "is_distance", "address", "contact", "contact_phone" , "link", "status", "date_inserted"],
        ["id" => $id], 1);
    if (!$event) {
        bad_method();
    }

    if ($event["status"] != EVENT_STATUS_PUBLISHED) {
        $user = get_log_user();
        if ( !$user->is_connected() || ($user->get_permission_level() < PERMISSION_MODERATOR && $user->getId() !== $event["author"])) {
            forbidden();
        }
    }
    success($event);
}

function _admin_fetch_events($query) {
    admin_fetch(TABLE_EVENT, ["id", "author", "picture", "name", "description", "start_date", "end_date", "max_user", "is_distance", "address", "contact", "contact_phone" , "link", "status", "date_inserted"], $query, 'id');
}

function _change_status_event() {
    if (!is_moderator()) {
        forbidden();
    }
    $status = $_POST["status"]??null;
    $eventID = $_POST["event"]??null;
    $reason = $_POST["reason"]??null;
    if ($reason === null) {
        $reason = "";
    }

    if (!is_numeric($status) || intval($status) < 0 || $status > EVENT_STATUS_PUBLISHED) {
        bad_request("wrong status");
    }

    $event = getDB()->select(TABLE_EVENT, ['id', 'author', 'name'], ["id" => $eventID], 1);
    if (!$event) {
        bad_request("wrong event");
    }
    if (strlen($reason) > 255) {
        bad_request("La raison ne doit pas dépasser les 255 caractères.");
    }

    getDB()->update(TABLE_EVENT, ["status" => $status], ["id" => $eventID]);

    // send mail
    $text_status = "";
    switch ($status) {
        case EVENT_STATUS_WAIT_VERIFICATION: $text_status = "En attente de vérification"; break;
        case EVENT_STATUS_REJECT: $text_status = "Rejeté"; break;
        case EVENT_STATUS_ACCEPTED_NO_CONTENT: $text_status = "Accepté, en attente de contenu"; break;
        case EVENT_STATUS_PUBLISHED: $text_status = "Publié"; break;
    }

    if ($event["author"]) {
        $user = getDB()->select(TABLE_USER, ['username', 'email'], ['id' => $event["author"]], 1);
        if ($user) {
            send_event_status_change_mail($text_status, $event['name'], $user["email"], $user["username"]);
        }
    }
    success();
}

//TODO to change
function _delete_event($id) {
    if (!is_admin()) {
        unauthorized();
    }

    $event = getDB()->select(TABLE_EVENT, ["id", "author", "picture", "name", "description", "start_date", "end_date", "max_user", "is_distance", "address", "contact", "contact_phone" , "link", "status", "date_inserted"], ["id" => $id], 1);
    if ($event) {
        getDB()->delete(TABLE_EVENT, ["id" => $id]);
        success();
    } else {
        bad_request("no event " .$event);
    }
}

function _edit_event() {
    $user = get_log_user();
    if (!$user->is_connected()) {
        unauthorized();
    }

    if (getDB()->count(TABLE_EVENT, 'id', ['author' => $user->getId(), 'status' => EVENT_STATUS_WAIT_VERIFICATION]) > 1) {
        bad_request("l'utilisateur a deja un évènement en attente de vérification.");
    }

    $name = $_POST["name"] ?? null;
    $startDate = $_POST["start_date"] ?? null;
    $endDate = $_POST["end_date"] ?? null;
    $maxUser = $_POST["max_user"] ?? null;
    $isDistance = $_POST["is_distance"] ?? null;
    $address = $_POST["address"] ?? null;
    $contact = $_POST["contact"] ?? null;
    $contactPhone = $_POST["contact_phone"] ?? null;
    $link = $_POST["link"] ?? null;
    $description = $_POST["description"] ?? null;

    $error = [];

    if ($name === null || strlen($name) < 2 || strlen($name) > 100) {
        $error[] = "Titre invalide.";
    }
    if ($direction === null || ($direction != '1' && $direction != '2')) {
        $error[] = "Sens de lecture invalide.";
    }
    if ($description === null || strlen($name) < 1 || strlen($name) > 2000) {
        $error[] = "Description trop longue (2000 max.) ou inexistante.";
    }

    if ($project === null) {
        $error[] = 'Projet invalide';
    } else {
        $projectDB = getDB()->select(TABLE_EVENT, ['author'], ['id' => $project], 1);
        if (!$projectDB) {
            $error[] = 'Projet invalide';
        }
        if ($user->getId() !== $projectDB['author'] && $user->get_permission_level() < PERMISSION_MODERATOR) {
            unauthorized();
        }
    }

    if (empty($error)) {
        getDB()->update(TABLE_EVENT, [
            "title" => $name,
            "description" => $description,
            "reading_direction" => $direction,
        ], ['id' => $id]);
    }

    if (!empty($error)) {
        bad_request($error);
    }
    success();
}
<?php

/**
 * @throws Exception
 */
function invokeEvent($method, $function, $query) {
    if ($method === "POST") {
        if ($function[0] === 'create') {
            _new_event();
        }
        elseif ($function[0] === 'validation') {
            _change_status_event();
        }
        elseif ($function[0] === 'edit') {
            _edit_event();
        } elseif ($function[0] === 'join') {
            _event_add_user($query, false);
        } elseif ($function[0] === 'leave') {
            _event_add_user($query, true);
        }
    } elseif ($method === "GET") {
        $count = count($function);
        if ($count === 1 && $function[0] === 'all') {
            _admin_fetch_events($query);
        } elseif (count($function) === 1) {
            _fetch_event($function[0]);
        } elseif (count($function) === 0) {
            _fetch_event_list($query);
        }
    } elseif ($method === "DELETE") {
        if (count($function) === 1) {
            _delete_event($function[0]);
        }
    } else {
        bad_method();
    }
}

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

    $name = $_POST["title"] ?? null;
    $startDate = strtotime($_POST["dateStart"] ?? null);
    $endDate = strtotime($_POST["dateEnd"] ?? null);
    $maxUser = $_POST["nbPer"] ?? null;
    $isDistance = $_POST["format"] ?? null;
    $address = $_POST["address"] ?? null;
    $contact = $_POST["contactName"] ?? null;
    $contactPhone = $_POST["contactTel"] ?? null;
    $link = $_POST["link"] ?? null;
    $description = $_POST["description"] ?? null;

    $error = [];

    if ($name === null || strlen($name) < 1 || strlen($name) > 100) {
        $error[] = "Titre invalide.";
    }

    if ($startDate <= time()) $error[] = "Vous ne pouvez pas créer d'évènement commençant aujourd'hui ou avant.";
    if ($endDate <= $startDate) $error[] = "La date de fin ne dois pas être inférieur à la date de début";

    if ($maxUser === null || ($maxUser <= 0)) {
        $error[] = "Nombre max. de participants invalide.";
    }
    if ($maxUser === '' ) $maxUser = -1;

    if ($isDistance != '1' && $isDistance != '2') {
        $error[] = "Préférence de présence invalide.";
    }

    if ($address === null) {
        $error[] = "Adresse invalide.";
    } elseif (strlen($address) === 0) $address = null;

    if ($contact === null || strlen($contact) < 1 || strlen($contact) > 100) {
        $error[] = "Nom du contact invalide.";
    }
    if ($contactPhone === null || strlen($contactPhone) < 1 || strlen($contactPhone) > 20) {
        $error[] = "Numéro du contact invalide.";
    }

    if ($link === null) {
        $error[] = "Lien invalide.";
    } elseif (strlen($link) === 0) $link = null;

    if ($description === null || strlen($description) < 1 || strlen($description) > 2000) {
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
            $img->set_title("Image pour l'évènement " . substr($name, 0, 20) . '...');
            $img->add_logo();
            $img->save();
            getDB()->insert(TABLE_EVENT, [
                "author" => $user->getId(),
                "picture" => $img->get_id(),
                "name" => $name,
                "description" => $description,
                "max_user" => $maxUser,
                "start_date" => $_POST["dateStart"],
                "end_date" => $_POST["dateEnd"],
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
    admin_fetch(TABLE_EVENT, ["id", "author", "picture", "name", "description", "start_date", "end_date", "max_user", "is_distance", "address", "contact", "contact_phone" , "link", "status", "date_inserted"], $query, 'id', ['name', 'description']);
}

function __get_id_from_name($name) {
    if ($name === 'me') {
        $user = get_log_user();
        if ($user->is_connected()) return $user->getId();
        else return null;
    } elseif (is_numeric($name)) {
        return $name;
    } else {
        $raw = getDB()->select(TABLE_USER, ['id'], ['username' => $name], 1);
        if (!$raw) return null;
        else return $raw['id'];
    }
}

function _fetch_event_list($query) {
    $col = ["id", "author", "picture", "name", "description", "start_date", "end_date", "max_user", "is_distance", "address", "contact", "contact_phone" , "link", "status", "date_inserted"];

    $filter_author = null;
    $filter_participant = null;

    if (isset($query['author'])) {
        $filter_author = __get_id_from_name($query['author']);
        if ($filter_author === null) success([]);
    }

    if (isset($query['participant'])) {
        $filter_participant = __get_id_from_name($query['participant']);
        if ($filter_participant === null) success([]);
    }

    $where = ['status' =>  EVENT_STATUS_PUBLISHED, "end_date" => ['o' => '>=', 'v' => time()]];
    if ($filter_author !== null) {
        if ($query['author'] === 'me') {
            unset($where['status']);
            unset($where['end_date']);
        }
        $where['author'] = $filter_author;
    }


    if ($filter_participant === null)
    {
        $events = getDB()->select(TABLE_EVENT, $col, $where, 0, 'start_date ASC');
    } else {
        $col = join(', ', $col);
        $where['user_id'] = $filter_participant;
        $events = getDB()->select_set_settings("SELECT $col FROM PAE_EVENT_USER LEFT JOIN PAE_EVENT PE ON PAE_EVENT_USER.event_id = PE.id", $where, 0, 'start_date ASC');
    }


    if (count($events) === 0) success([]);
    $id = array_map(function ($e) {return $e['id'];}, $events);



    $req = getDB()->get_pdo()->prepare("SELECT event_id, user_id as id, username, avatar
                                                FROM PAE_EVENT_USER
                                                LEFT JOIN PAE_USER PU on PAE_EVENT_USER.user_id = PU.id
                                                WHERE event_id IN (" . join(',', $id) . ')');
    $req->execute();
    $users = $req->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);

    $final_data = [];

    foreach ($events as $event) {
        $event['users'] = $users[$event["id"]]??[];
        $final_data[] = $event;
    }

    success($final_data);
}

function _event_add_user($query, $leave) {
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();
    $event = $query['e']??null;
    if (!is_numeric($event)) bad_request('Evènements inexistant ou terminé');
    $eSQL = getDB()->select(TABLE_EVENT, ['id', 'max_user'], ['id' => $event, 'status' =>  EVENT_STATUS_PUBLISHED, "end_date" => ['o' => '>=', 'v' => time()]],1);
    if (!$eSQL) bad_request('Evènements inexistant ou terminé');
    if ($leave) {
        getDB()->delete(TABLE_EVENT_USER, ['user_id' => $user->getId(), 'event_id' => $eSQL['id']]);
    }
    else {
        if (intval($eSQL['max_user']) > 0) {
            if (intval($eSQL['max_user']) <= getDB()->count(TABLE_EVENT_USER, 'user_id', ['event_id' => $eSQL['id']])) {
                bad_request('Evènements complet');
            }
        }
        getDB()->insert(TABLE_EVENT_USER, ['user_id' => $user->getId(), 'event_id' => $eSQL['id']], true);
    }
    success();
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
    if (strlen($reason) > 255) {
        bad_request("La raison ne doit pas dépasser les 255 caractères.");
    }

    $event = getDB()->select(TABLE_EVENT, ['id', 'author', 'name'], ["id" => $eventID], 1);
    if (!$event) {
        bad_request("wrong event");
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
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();

    $event = getDB()->select(TABLE_EVENT, ["id", 'author', 'picture'], ["id" => $id], 1);
    if ($event) {
        if (is_moderator() || $user->getId() == $event['author']) {
            try {
                Picture::delete($event['picture']);
            } catch (Exception $e) {}
            getDB()->delete(TABLE_EVENT, ["id" => $id]);
            success();
        } else unauthorized();
    } else {
        bad_request("no event " .$event);
    }
}

function _edit_event() {
//    $user = get_log_user();
//    if (!$user->is_connected()) {
//        unauthorized();
//    }
//
//    if (getDB()->count(TABLE_EVENT, 'id', ['author' => $user->getId(), 'status' => EVENT_STATUS_WAIT_VERIFICATION]) > 1) {
//        bad_request("l'utilisateur a deja un évènement en attente de vérification.");
//    }
//
//    $name = $_POST["name"] ?? null;
//    $startDate = $_POST["start_date"] ?? null;
//    $endDate = $_POST["end_date"] ?? null;
//    $maxUser = $_POST["max_user"] ?? null;
//    $isDistance = $_POST["is_distance"] ?? null;
//    $address = $_POST["address"] ?? null;
//    $contact = $_POST["contact"] ?? null;
//    $contactPhone = $_POST["contact_phone"] ?? null;
//    $link = $_POST["link"] ?? null;
//    $description = $_POST["description"] ?? null;
//
//    $error = [];
//
//    if ($name === null || strlen($name) < 2 || strlen($name) > 100) {
//        $error[] = "Titre invalide.";
//    }
//    if ($direction === null || ($direction != '1' && $direction != '2')) {
//        $error[] = "Sens de lecture invalide.";
//    }
//    if ($description === null || strlen($name) < 1 || strlen($name) > 2000) {
//        $error[] = "Description trop longue (2000 max.) ou inexistante.";
//    }
//
//    if ($project === null) {
//        $error[] = 'Projet invalide';
//    } else {
//        $projectDB = getDB()->select(TABLE_EVENT, ['author'], ['id' => $project], 1);
//        if (!$projectDB) {
//            $error[] = 'Projet invalide';
//        }
//        if ($user->getId() !== $projectDB['author'] && $user->get_permission_level() < PERMISSION_MODERATOR) {
//            unauthorized();
//        }
//    }
//
//    if (empty($error)) {
//        getDB()->update(TABLE_EVENT, [
//            "title" => $name,
//            "description" => $description,
//            "reading_direction" => $direction,
//        ], ['id' => $id]);
//    }
//
//    if (!empty($error)) {
//        bad_request($error);
//    }
//    success();
}
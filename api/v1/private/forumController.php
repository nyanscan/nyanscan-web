<?php

const MESSAGE_SHORT_REQ = "SELECT id, author, topic, reply, content, date_inserted, status FROM " . DB_PREFIX . TABLE_FORUM_MESSAGE;

const MESSAGE_FULL_REQ = "
        SELECT M.id            AS id,
               M.content       AS content,
               M.date_inserted AS date_inserted,
               M.status        AS status,
        
               R.id            AS reply_id,
               R.content       AS reply_content,
               R.date_inserted AS reply_date_inserted,
               R.status        AS reply_status,
        
               T.id            AS topic_id,
               T.name          AS topic_name,
               T.category      AS topic_category,
               T.date_inserted AS topic_date_inserted,
               T.last_message  AS topic_last_message,
        
               A.id            AS author_id,
               A.username      AS author_username
        FROM " . DB_PREFIX . TABLE_FORUM_MESSAGE . " AS M
                 LEFT JOIN " . DB_PREFIX . TABLE_USER . " A ON A.id = M.author
                 LEFT JOIN " . DB_PREFIX . TABLE_FORUM_TOPIC . " T ON T.id = M.topic
                 LEFT JOIN " . DB_PREFIX . TABLE_FORUM_MESSAGE . " R ON R.id = M.reply";

function invokeForm($method, $function, $query)
{
    if ($method === "POST") {
        if (count($function) === 1 && $function[0] === "category") _create_category();
        elseif (count($function) === 1 && $function[0] === "topic") _create_topic();
        elseif (count($function) === 1 && $function[0] === "message") _create_message();
    } elseif ($method === "GET") {
        if (count($function) === 2 && $function[0] == "category") {
            if ($function[1] === "all") _get_all_category();
            if ($function[1] === "root") _get_root_category();
            else _get_category($function[1]);
        } elseif (count($function) === 3 && $function[0] == "category" && $function[2] === "topics") {
            _get_topic_from_category($function[1], $query);
        } elseif (count($function) === 2 && $function[0] === "topic") {
            _get_topic($function[1]);
        } elseif (count($function) === 2 && $function[0] === "message") {
            _get_message($function[1], $query);
        } elseif (count($function) === 1 && $function[0] === "messages") {
            _get_messages($query);
        }
    } else bad_method();
}


// GET

function _get_root_category() {
    $raw = get_all_full_category(FORUM_PERMISSION_VIEW_ADMIN);
    $final = [];
    foreach ($raw as $row) {
        $cat = $row["cat_id"];
        if (!isset($final[$cat]))
            $final[$cat] = ["id" => $cat, "name" => $row["cat_name"], "description" => $row["cat_description"], "topics" => []];
        $topic = [
            "id" => $row["topic_id"],
            "name" => $row["topic_name"],
            "date_inserted" => $row["topic_date_inserted"],
            "last_message" => [
                "id" => $row["message_id"],
                "date_inserted" => $row["message_date_inserted"],
                "author" => [
                    "id" => $row["author_id"],
                    "username" => $row["author_username"]
                    ]
            ]
        ];
        $final[$cat]["topics"][] = $topic;
    }
    success($final);
}

function _get_all_category()
{
    success(get_all_visible_category( FORUM_PERMISSION_VIEW_ADMIN));
}

function _get_category($id)
{
    if (empty($id)) bad_request('invalid category');
    $cat = get_category($id);
    if (!$cat) bad_request('invalid category');
    success($cat);
}

function _get_topic($id)
{
    if (empty($id)) bad_request('invalid category');
    success(getDB()->select(TABLE_FORUM_TOPIC, ['name', 'category', 'date_inserted', 'last_message'], ["id" => $id], 1));
}

function _get_topic_from_category($id, $query)
{
    $limit = max(0, min(50, intval($query['limit'] ?? 10)));
    $offset = intval($query['offset'] ?? 0);

    if (empty($id)) bad_request('invalid category');

    success(getDB()->select(TABLE_FORUM_TOPIC, ['id', 'name', 'date_inserted', 'last_message'],
        ["category" => $id], $limit, 'last_message DESC', $offset));
}

function _get_message($id, $query)
{
    if (empty($id)) bad_request('invalid category');
    if (empty($query["full"]) || $query["full"] == '0')
        success(getDB()->select_set_settings(MESSAGE_SHORT_REQ, ["id" => $id], 1));
    else {
        success(concatenate_array_by_prefix(
            getDB()->select_set_settings(MESSAGE_FULL_REQ, ["M.id" => $id], 1),
            ["replay", "author", "topic"]));
    }
}

function _get_messages($query)
{
    $limit = max(1, min(50, intval($query['limit'] ?? 10)));
    $offset = intval($query['offset'] ?? 0);
    $full = !(empty($query["full"]) || $query["full"] == '0');
    $topic = $query["topic"] ?? null;
    $author = $query["author"] ?? null;

    if ($topic === null && $author === null) bad_request("no topic or author specified");

    $where = [];
    if ($author !== null) $where[$full ? 'M.author' : 'author'] = $author;
    if ($topic !== null) $where[$full ? 'M.topic' : 'topic'] = $topic;

    $data = getDB()->select_set_settings($full ? MESSAGE_FULL_REQ : MESSAGE_SHORT_REQ, $where,
    $limit, ($full ? 'M.date_inserted' : 'date_inserted') . ' DESC', $offset);

    if ($full) {
        $final = [];
        foreach ($data as $d) {
            $final[] = concatenate_array_by_prefix($d, ["replay", "author", "topic"]);
        }
        success($final);
    } else success($data);
}

// POST

function _create_message()
{
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();

    $errors = [];

    $message = $_POST["message"] ?? "";
    $topic = $_POST["topic"]??null;
    $replay = $_POST["reply"]??null;

    if ($topic === null) bad_request('invalid topic');
    $sql_topic = getDB()->select(TABLE_FORUM_TOPIC, ['id'], ["id" => $topic], 1);
    if (!$sql_topic) bad_request('invalid topic');

    if (strlen($message) < 10 || strlen($message) > 2000) $errors["$message"] = 'Le $message doit contenir au minimum 10 caractéres et au maximum 2000 !';
    $sql_reply = null;
    if($replay !== null) {
        $sql_reply = getDB()->select(TABLE_FORUM_MESSAGE, ['id'], ["id" => $replay], 1);
        if (!$sql_reply) bad_request('invalid replay');
    }

    $data = ["author" => $user->getId(), "topic" => $sql_topic["id"], "content" => $message];
    if ($replay !== null) $data["reply"] = $sql_reply["id"];

    getDB()->insert(TABLE_FORUM_MESSAGE, $data);
    $req = getDB()->get_pdo()->prepare("UPDATE " . DB_PREFIX.TABLE_FORUM_TOPIC . " SET last_message=(SELECT id FROM ".DB_PREFIX.TABLE_FORUM_MESSAGE." WHERE topic=:topic ORDER BY date_inserted DESC LIMIT 1) WHERE id=:topic");
    $req->execute(["topic" => $topic]);
    success();
}

function _create_topic()
{
//    $user = get_log_user();
//    if (!$user->is_connected()) unauthorized();

    $errors = [];

    $category = $_POST["category"] ?? "";
    $title = trim($_POST["title"] ?? "");
    $message = $_POST["message"] ?? "";

    if (empty($category)) bad_request('invalid category');
    $cat = get_category($category);
    if (!$cat) bad_request('invalid category');

    if (strlen($title) < 5 || strlen($title) > 100) $errors["title"] = 'Le titre doit contenir au minimum 5 caractéres et au maximum 100 !';
    if (strlen($message) < 10 || strlen($message) > 2000) $errors["$message"] = 'Le $message doit contenir au minimum 10 caractéres et au maximum 2000 !';

    if (count($errors) !== 0) bad_request($errors);

    getDB()->insert(TABLE_FORUM_TOPIC, ["name" => $title, "category" => $cat["id"]]);
    $id = getDB()->select(TABLE_FORUM_TOPIC, ['id'], ["name" => $title], 1, 'date_inserted DESC')['id'];
    getDB()->insert(TABLE_FORUM_MESSAGE, ["author" => 1, "topic" => $id, "content" => $message]);
    update_topic_last_message($id);
    success();
}

function _create_category()
{
    $errors = [];
    // todo permission

    $title = trim($_POST["title"] ?? "");
    $description = trim($_POST["description"] ?? "");
    $view = trim($_POST["view"] ?? -1);
    $create = trim($_POST["create"] ?? -1);

    if (strlen($title) < 5 || strlen($title) > 100) $errors["title"] = 'Le titre doit contenir au minimum 5 caractéres et au maximum 100 !';
    if (strlen($description) > 255) $errors["description"] = 'La description doit contenir au maximum 255 caractéres !';

    if (!in_array($view, [0, 1, 2, 3])) $errors["view"] = 'La préférence de vue est invalide !';
    if (!in_array($create, [0, 1, 2, 3])) $errors["view"] = 'La préférence de création est invalide !';

    if (count($errors) === 0) {
        create_category($title, $description, $view, $create);
        success();
    } else bad_request($errors);
}

// like / dislike
function _like_message()
{
}

// DELETE

function _block_message()
{
}

function _delete_message()
{
}

function _delete_topic()
{
}

function _delete_category()
{
}

// EDIT

function _edit_category()
{
}

function _edit_topic()
{
}

// content ; reply ;
function _edit_message()
{
}
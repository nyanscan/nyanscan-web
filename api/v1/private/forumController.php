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
                 LEFT JOIN " . DB_PREFIX . TABLE_FORUM_MESSAGE . " R ON R.id = M.reply
                LEFT JOIN "  . DB_PREFIX . TABLE_FORUM_CATEGORY . " C On T.category = C.id
";

function invokeForm($method, $function, $query)
{
    if ($method === "POST") {
        if (count($function) === 1 && $function[0] === "category") _create_category();
        elseif (count($function) === 1 && $function[0] === "topic") _create_topic();
        elseif (count($function) === 1 && $function[0] === "message") _create_message();
        elseif (count($function) === 1 && $function[0] === "reply") _create_reply();
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
    $user = get_log_user();
    $perm = $user->getForumViewLevel();
    $raw = get_all_full_category($perm);
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
    $perm = get_log_user()->getForumViewLevel();
    if ($cat["permission"] & FORUM_PERMISSION_VIEW_MASK <= $perm & FORUM_PERMISSION_VIEW_MASK)
        success($cat);
    bad_request();
}

function _get_topic($id)
{
    if (empty($id)) bad_request('invalid category');
    success(getDB()->select(TABLE_FORUM_TOPIC, ['name', 'category', 'date_inserted', 'last_message'], ["id" => $id], 1));
}

function _get_topic_from_category($id, $query)
{
    $limit = max(0, min(20, intval($query['limit'] ?? 10)));
    $offset = intval($query['offset'] ?? 0);
    $count = $query["count"] ?? '0';

    $user = get_log_user();
    $perm = $user->getForumViewLevel();

    if (empty($id)) bad_request('invalid category');

    $category = getDB()->select(TABLE_FORUM_CATEGORY, ['name', 'description', 'permission'], ["id" => $id], 1);
//    echo $category['permission']  & FORUM_PERMISSION_VIEW_MASK;
    if (!$category || ($category['permission'] & FORUM_PERMISSION_VIEW_MASK) > $perm) bad_request('invalid category');

    $data = [];

    $data["topics"] = array_map(function ($array) {
        return concatenate_array_by_prefix($array, ["message", "author"]);
    } ,getDB()->select_set_settings('SELECT
                   T.id            AS id,
                   T.name          AS name,
                   T.date_inserted AS date_inserted,
                   M.id            AS message_id,
                   M.date_inserted AS message_date_inserted,
                   A.id            AS author_id,
                   A.username      AS author_username

            FROM PAE_FORUM_TOPIC AS T
                     LEFT JOIN PAE_FORUM_MESSAGE AS M ON T.last_message = M.id
                     LEFT JOIN PAE_USER A ON A.id = M.author', ["T.category" => $id], $limit, 'T.last_message DESC', $offset));
    $data["category"] = [
        "id" => $id,
        "name" => $category["name"],
        "description" => $category["description"],
    ];
    if ($count !== '0') {
        if ($data["topics"]) {
            $data["total"] = getDB()->count(TABLE_FORUM_TOPIC, 'id', ['category' => $id]);
        } else $data["total"] = 0;
    }
    success($data);
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
    $user = get_log_user();
    $perm = $user->getForumViewLevel();
    $limit = max(1, min(50, intval($query['limit'] ?? 10)));
    $offset = intval($query['offset'] ?? 0);
    $topic = $query["topic"] ?? null;
    $author = $query["author"] ?? null;
    $count = $query["count"] ?? '0';

    if ($topic === null && $author === null) bad_request("no topic or author specified");

    $where = [];
    if ($author !== null) $where['M.author'] = $author;
    if ($topic !== null) $where['M.topic'] = $topic;

    $data = getDB()->select_set_settings(MESSAGE_FULL_REQ . (" WHERE ²(C.permission & ".FORUM_PERMISSION_VIEW_MASK.") <= ".$perm), $where,
        $limit, ('M.date_inserted') . ' DESC', $offset, true);

    $final = [];
    foreach ($data as $d) {
        $final[] = concatenate_array_by_prefix($d, ["replay", "author", "topic"]);
    }

    if ($final && $count) {

    }

    success($final);
}

// POST

function _create_message()
{
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();

    $errors = [];

    $message = $_POST["message"] ?? "";
    $topic = $_POST["topic"]??null;

    if ($topic === null) bad_request('invalid topic');
    $sql_topic = getDB()->select(TABLE_FORUM_TOPIC, ['id'], ["id" => $topic], 1);
    if (!$sql_topic) bad_request('invalid topic');

    if (strlen($message) < 1 || strlen($message) > 2000) $errors["$message"] = 'Le $message doit contenir au minimum 1 caractére et au maximum 2000 !';

    $data = ["author" => $user->getId(), "topic" => $sql_topic["id"], "content" => $message];

    getDB()->insert(TABLE_FORUM_MESSAGE, $data);
    $req = getDB()->get_pdo()->prepare("UPDATE " . DB_PREFIX.TABLE_FORUM_TOPIC . " SET last_message=(SELECT id FROM ".DB_PREFIX.TABLE_FORUM_MESSAGE." WHERE topic=:topic ORDER BY date_inserted DESC LIMIT 1) WHERE id=:topic");
    $req->execute(["topic" => $topic]);
    success();
}

function _create_reply() {
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();

    $message = $_POST["message"] ?? "";
    $reply = $_POST["reply"]??null;

    if ($reply === null) bad_request('invalid reply');
    $sql_reply = getDB()->select(TABLE_FORUM_MESSAGE, ['id'], ["id" => $reply], 1);
    if (!$sql_reply) bad_request('invalid reply');

    if (strlen($message) < 1 || strlen($message) > 2000) $errors["$message"] = 'Le $message doit contenir au minimum 1 caractére et au maximum 2000 !';

    $data = ["author" => $user->getId(), "reply" => $sql_reply["id"], "content" => $message];
    getDB()->insert(TABLE_FORUM_REPLY, $data);
    success();

}

function _create_topic()
{
    $user = get_log_user();
    if (!$user->is_connected()) unauthorized();

    $errors = [];

    $category = $_POST["category"] ?? "";
    $title = trim($_POST["title"] ?? "");
    $message = $_POST["message"] ?? "";

    if (empty($category)) bad_request('invalid category');
    $cat = get_category($category);
    if (!$cat || ($cat['permission'] & FORUM_PERMISSION_VIEW_MASK) > $user->getForumViewLevel()) bad_request('invalid category');

    if (strlen($title) < 5 || strlen($title) > 100) $errors["title"] = 'Le titre doit contenir au minimum 5 caractéres et au maximum 100 !';
    if (strlen($message) < 10 || strlen($message) > 2000) $errors["$message"] = 'Le $message doit contenir au minimum 10 caractéres et au maximum 2000 !';

    if (count($errors) !== 0) bad_request($errors);

    getDB()->insert(TABLE_FORUM_TOPIC, ["name" => $title, "category" => $cat["id"]]);
    $id = getDB()->select(TABLE_FORUM_TOPIC, ['id'], ["name" => $title], 1, 'date_inserted DESC')['id'];
    getDB()->insert(TABLE_FORUM_MESSAGE, ["author" => $user->getId(), "topic" => $id, "content" => $message]);
    update_topic_last_message($id);
    success();
}

function _create_category()
{
    $user = get_log_user();
    if (!$user->getForumViewLevel() < FORUM_PERMISSION_CREATE_ADMIN) unauthorized();
    $errors = [];

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
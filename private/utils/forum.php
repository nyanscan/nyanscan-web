<?php
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

function delete_category($id) : bool {
    return getDB()->delete(TABLE_FORUM_CATEGORY, ["id" => $id]);
}

/**
 * fetch one category
 * @param $id int
 * @param string[] $column
 * @return array|null
 */
function get_category(int $id, array $column = ["id", "name", "description", "permission_create", "permission_view"]): ?array
{
    if (!is_numeric($id)) return null;
    return getDB()->select(TABLE_FORUM_CATEGORY, $column, ["id" => $id], 1)?:null;
}

function get_all_visible_category($view_level, $column = ["id", "name", "description", "permission", "permission_create", "permission_view"]) {
    $req =getDB()->get_pdo()->prepare("SELECT " . join(', ', $column) . " FROM ".DB_PREFIX.TABLE_FORUM_CATEGORY." WHERE permission_view <= :level");
    $req->execute([
        "level" => $view_level
    ]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}

function update_topic_last_message($topic) {
    $req = getDB()->get_pdo()->prepare("UPDATE ".DB_PREFIX.TABLE_FORUM_TOPIC." SET last_message=(SELECT id FROM ".DB_PREFIX.TABLE_FORUM_MESSAGE." WHERE topic=:topic ORDER BY date_inserted DESC LIMIT 1) WHERE id=:topic;");
    $req->execute(["topic" => $topic]);
}

function get_all_full_category($view_level) {
    return getDB()->select(VIEW_ROOT_FORUM_CATEGORIES, ['*'], ['num' => ['v' => 5, 'o' => '<=']], 0, 'cat_id, num');
}
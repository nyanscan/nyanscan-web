<?php
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

/**
 * create new category
 * warn no check is mak at this level
 *
 * @param $title string
 * @param $description string
 * @param $view_level int
 * @param $create_level int
 * @return void
 */
function create_category(string $title, string $description, int $view_level, int $create_level) {
    getDB()->insert(TABLE_FORUM_CATEGORY, [
        "name" => $title,
        "description" => $description,
        "permission_view" => $view_level & PERMISSION_MASK,
        "permission_create" => $create_level & PERMISSION_MASK
    ]);
}

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
    $req = getDB()->get_pdo()->prepare("
                    SELECT *
                    FROM (SELECT 
                              *,
                              ROW_NUMBER() OVER (PARTITION BY cat_id ORDER BY message_date_inserted DESC) AS num
                        FROM (SELECT 
                                  C.id            AS cat_id,
                                  C.name          AS cat_name,
                                  C.description   AS cat_description,
                                  T.id            AS topic_id,
                                  T.name          AS topic_name,
                                  T.date_inserted AS topic_date_inserted,
                                  M.id            AS message_id,
                                  M.date_inserted AS message_date_inserted,
                                  A.id            AS author_id,
                                  A.username      AS author_username
                            FROM PAE_FORUM_CATEGORY AS C
                            LEFT JOIN PAE_FORUM_TOPIC AS T ON C.id = T.category
                            LEFT JOIN PAE_FORUM_MESSAGE AS M ON T.last_message = M.id
                            LEFT JOIN PAE_USER A ON A.id = M.author
                            WHERE (C.permission_view) <= $view_level) G) FG
                    WHERE FG.num <= 5
                    ORDER BY FG.CAT_ID, FG.NUM;
    ");
    $req->execute();
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
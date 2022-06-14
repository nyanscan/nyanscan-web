<?php
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

function create_category($title, $description, $view_level, $create_level) {
    getDB()->insert(TABLE_FORUM_CATEGORY, [
        "name" => $title,
        "description" => $description,
        "permission" => ($view_level & 0b1111) | (($create_level & 0b1111) << 4)
    ]);
}

function delete_category($id) : bool {
    return getDB()->delete(TABLE_FORUM_CATEGORY, ["id" => $id]);
}

function get_category($id, $column = ["id, name, description"]) {
    if (!is_numeric($id)) return null;
    return getDB()->select('FORUM_CATEGORY', $column, ["id" => $id], 1);
}

function get_all_visible_category($view_level, $column = ["id, name, description"]) {
    $req =getDB()->get_pdo()->prepare("SELECT " . join(', ', $column) . " FROM PAE_FORUM_CATEGORY WHERE (permission & :mask) <= :level");
    $req->execute([
        "mask" => FORUM_PERMISSION_VIEW_MASK,
        "level" => $view_level & FORUM_PERMISSION_VIEW_MASK
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
                            WHERE (C.permission & ".FORUM_PERMISSION_VIEW_MASK.") <= ".($view_level & FORUM_PERMISSION_VIEW_MASK).") G) FG
                    WHERE FG.num <= 5
                    ORDER BY FG.CAT_ID, FG.NUM;
    ");
    $req->execute();
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
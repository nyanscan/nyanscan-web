<?php
require 'const.php';
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

function create_category($title, $description, $view_level, $create_level)
{
    getDB()->insert(TABLE_FORUM_CATEGORY, [
        "name" => $title,
        "description" => $description,
        "permission" => ($view_level & 0b1111) | (($create_level & 0b1111) << 4)
    ]);
}

function delete_category($id) : bool
{
    return getDB()->delete(TABLE_FORUM_CATEGORY, ["id" => $id]);
}

function get_category($id, $column = ["id, name, description"])
{
    if (!is_numeric($id)) return null;
    return getDB()->select('FORUM_CATEGORY', $column, ["id" => $id], 1);
}

function get_all_visible_category($view_level, $column = ["id, name, description"])
{
    $req =getDB()->get_pdo()->prepare("SELECT " . join(', ', $column) . " FROM PAE_FORUM_CATEGORY WHERE (permission & :mask) <= :level");
    $req->execute([
        "mask" => FORUM_PERMISSION_VIEW_MASK,
        "level" => $view_level & FORUM_PERMISSION_VIEW_MASK
    ]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
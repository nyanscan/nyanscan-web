<?php
require 'const.php';
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

function create_category($title, $description, $view_level, $create_level, $db = null)
{
    $db = $db ?: connectDB();
    $req = $db->prepare("INSERT INTO PAE_FORUM_CATEGORY (name, description, permission) VALUE (:name, :description, :permission)");
    $req->execute([
        "name" => $title,
        "description" => $description,
        "permission" => ($view_level & 0b1111) | (($create_level & 0b1111) << 4)
    ]);
}

function delete_category($id, $db = null)
{
    $db = $db ?: connectDB();
    $req = $db->prepare("DELETE FROM PAE_FORUM_CATEGORY WHERE id=?");
    $req->execute([$id]);
}

function get_category($id, $column = ["id, name, description"], $db = null)
{
    $db = $db ?: connectDB();
    if (is_numeric($id)) {
        $req = $db->prepare("SELECT " . join(', ', $column) . " FROM PAE_FORUM_CATEGORY WHERE id=? LIMIT 1");
    } else {
        return null;
    }
    $req->execute([$id]);
    return $req->fetch(PDO::FETCH_ASSOC);

}

function get_all_visible_category($view_level, $column = ["id, name, description"], $db = null)
{
    $db = $db ?: connectDB();
    $req = $db->prepare("SELECT " . join(', ', $column) . " FROM PAE_FORUM_CATEGORY WHERE (permission & :mask) <= :level");
    $req->execute([
        "mask" => FORUM_PERMISSION_VIEW_MASK,
        "level" => $view_level & FORUM_PERMISSION_VIEW_MASK
    ]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
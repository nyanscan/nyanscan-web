<?php
require 'const.php';
require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

function create_category($title, $description, $view_level, $create_level, $db=null) {
    $db = $db?:connectDB();
    $req = $db->prepare("INSERT INTO PAE_FORUM_CATEGORY (name, description, permission) VALUE (:name, :description, :permission)");
    $req->execute([
        "name" => $title,
        "description" => $description,
        "permission" => ($view_level & 0b1111) | (($create_level & 0b1111) << 4)
    ]);
}

function delete_category($id, $db=null) {
    $db = $db?:connectDB();
    $req = $db->prepare("DELETE FROM PAE_FORUM_CATEGORY WHERE id=?");
    $req->execute([$id]);
}

function get_category($id, $db=null) {
    $db = $db?:connectDB();
    $req = $db->prepare("SELECT * FROM PAE_FORUM_CATEGORY WHERE id=?");
    $req->execute([$id]);
    return $req->fetch();
}

function get_all_visible_category($view_level, $db=null) {
    $db = $db?:connectDB();
    $req = $db->prepare("SELECT * FROM PAE_FORUM_CATEGORY WHERE permission & :mask >= :level");
    $req->execute([
        "mask" => FORUM_PERMISSION_VIEW_MASK,
        "level" => $view_level & FORUM_PERMISSION_VIEW_MASK
    ]);
    return $req->fetchAll();
}
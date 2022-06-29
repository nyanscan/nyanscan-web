<?php

include $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';
use Jcupitt\Vips;

require 'config.php';
require 'DBAdapter.php';
require 'User.php';
require 'Picture.php';
require 'const.php';

/**
 * @deprecated
 * @return PDO|void
 */
function connectDB() {
    try {
        $pdo = new PDO(DB_DRIVER.":host=".DB_HOST.";dbname=".DB_NAME.";port=".DB_PORT, DB_USER, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (Exception $e) {
        die("SQL Exception". $e->getMessage());
    }
}

function getDB(): DBAdapter {
    return DBAdapter::$db_adapter_instance?:new DBAdapter();
}

function isConnected(): bool {
    return get_log_user()->is_connected();
}


function get_log_user(): User {
    return User::$current_user?:new User();
}

function createMD5Token(): string {
    return md5(time()*rand(1,1320)."HF6Ty.%%l78d£");
}

function redirectIfConnected() {
    if(isConnected()){
        header("Location: /");
        die();
    }
}

function redirectIfNotConnected() {
    if(!isConnected()){
        header("Location: /");
        die();
    }
}

function redirect404() {
    http_response_code(404);
    include $_SERVER['DOCUMENT_ROOT'] . '/error/404.php';
    die();
}

function json_exit($code, $message, $reason) {
    http_response_code($code);
    echo json_encode(["code" => $code, "message" => $message, "reason" => $reason]);
    exit();
}

function concatenate_array_by_prefix($array, $prefix): array {
    $final = [];
    foreach ($array as $key => $value) {
        $split = explode('_', $key, 2);
        if (in_array($split[0],$prefix)) {
            if (!isset($final[$split[0]])) {
                $final[$split[0]] = [$split[1] => $value];
            } else {
                $final[$split[0]][$split[1]] = $value;
            }
        } else {
            $final[$key] = $value;
        }
    }
    return $final;
}

function download_file_from_post($from_name, $dest_path, $max_size=5e5)  {
    if (empty($_FILES[$from_name]) || empty($_FILES[$from_name]["name"])) {
        return -1;
    }
    if ($_FILES[$from_name]["size"] > $max_size) {
        return -2;
    }

    $extend = strtolower(pathinfo(basename($_FILES[$from_name]['name']), PATHINFO_EXTENSION));
    $id = uniqid();
    $target_file = $dest_path . $id . '.' . $extend;
    if (move_uploaded_file($_FILES[$from_name]['tmp_name'], $target_file)) {
        return $target_file;
    } return -3;
}

/**
 * from create function
 * @throws Exception
 */
function download_image_from_post($from_name, $type=[], $max_size=1e6)  {
    $d_path = download_file_from_post($from_name, DOWNLOAD_PATH, $max_size);
    if (is_numeric($d_path) && intval($d_path) < 0) {
        return $d_path;
    }
    $check = getimagesize($d_path);
    if (!$check) {
        return -4;
    }
    $format = PICTURE_FORMAT_NONE;
    switch ($check[2]) {
        case IMAGETYPE_PNG: $format = PICTURE_FORMAT_PNG; break;
        case IMAGETYPE_WEBP: $format = PICTURE_FORMAT_WEBP; break;
        case IMAGETYPE_JPEG: $format = PICTURE_FORMAT_JPG; break;
        case IMAGETYPE_GIF: $format = PICTURE_FORMAT_GIF; break;
        default: return -4;
    }
    if (!empty($type) && !in_array($format, $type)) {
        $format = PICTURE_FORMAT_NONE;
    }
    $pic = new Picture();
    $pic -> create($d_path, $format, true);
    return $pic;
}

function download_volume_from_post($from_name, $max_size=5e8) {
    Vips\Config::CacheSetMax(0);
    Vips\Config::cacheSetMaxMem(1.2e9);



    set_time_limit(0);
    $d_path = download_file_from_post($from_name, DOWNLOAD_PATH, $max_size);
    if (is_numeric($d_path) && intval($d_path) < 0) {
        return $d_path;
    }

    $data = [
        "pages" => []
    ];
    $pager_count = 0;
    try {
        $image = Vips\Image::newFromFile($d_path);
        $n_pages = $image->get("n-pages");
        unset($image);
        for ($n = 0; $n < $n_pages; $n++) {

            $uuid = uniqidReal(24);
            $data["pages"][] = $uuid;

            $page = Vips\Image::newFromFile($d_path, [
                "dpi" => 30,
                "page" => $n,
                # this enables image streaming
                "access" => "sequential"
            ]);
            $dir = substr($uuid,  0,3);
            if (!file_exists(VOLUME_PATH . $dir)) {
                mkdir(VOLUME_PATH . $dir, 0775);
            }
            $page->writeToFile(VOLUME_PATH . $dir .  '/' . substr($uuid, 3) . '.webp');
            $pager_count++;
            unset($page);
        }
    } catch (Vips\Exception $e) {
        if ($e->getCode() !== 1) {
            $data["error"] = true;
        }
    } catch (Exception $e) {
        //for uniqidReal function
    } finally {
        unlink($d_path);
    }
    $data["count"] =  $pager_count;
    if (isset($data["error"])) return -4;
    return $data;
}

/**
 *
 * for random_bytes function
 * @throws Exception
 */
function uniqidReal($length = 13) {
    // uniqid gives 13 characters, but we could adjust it to your needs.
    if (function_exists("random_bytes")) {
        $bytes = random_bytes(ceil($length / 2));
    } elseif (function_exists("openssl_random_pseudo_bytes")) {
        $bytes = openssl_random_pseudo_bytes(ceil($length / 2));
    } else {
        throw new Exception("No cryptographic random secure function available");
    }
    return substr(bin2hex($bytes), 0, $length);
}

function is_dir_empty($dir): ?bool {
    if (!is_readable($dir)) {
        return null;
    }
    return (count(scandir($dir)) == 2);
}
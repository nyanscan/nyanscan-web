<?php

const CAPTCHA_WIDTH = 300;
const CAPTCHA_HEIGHT = 200;
const CAPTCHA_PIECE_SIZE = 40;
const CAPTCHA_CELL_SIZE = 10;
const CAPTCHA_NUMBER_PIECE = 3;
const CAPTCHA_CODE_GOOD = 1;
const CAPTCHA_CODE_FALSE = 2;
const CAPTCHA_CODE_ERROR = 3;

function get_captcha_status(): int {
    if (!isset($_POST["captcha-id"]) || !isset($_POST["captcha"]) || !isset($_SESSION["captcha"])) {
        return CAPTCHA_CODE_ERROR;
    }

    $id = $_POST["captcha-id"];

    if (!isset($_SESSION["captcha"][$id])) {
        return CAPTCHA_CODE_ERROR;
    } elseif ($_SESSION["captcha"][$id] === $_POST["captcha"]) {
        return CAPTCHA_CODE_GOOD;
    } else {
        return CAPTCHA_CODE_FALSE;
    }
}

function _get_captcha_settings() {
    success([
        "width" => CAPTCHA_WIDTH,
        "height" => CAPTCHA_HEIGHT,
        "piece_size" => CAPTCHA_PIECE_SIZE,
        "cell_size" => CAPTCHA_CELL_SIZE,
        "number_piece" => CAPTCHA_NUMBER_PIECE,
    ]);
}
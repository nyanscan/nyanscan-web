<?php

require __DIR__ . '/../private/captchaUtils.php';

$id = $_GET["id"] ?? null;

if (!$id) {
    http_response_code(500);
    exit();
}

session_start();

sleep(.5);

function get_piece() {
    $files = glob(__DIR__ . '/../private/res/piece/*.png');
    $i = imagecreatefrompng($files[array_rand($files)]);
    imagesavealpha($i, true);
    return $i;
}

function get_rdm_cords($p_cord, $token) {
    try {
        $cpt = 0;
        main_while: {
            //Prevent from crash if it does not work for some reason
            if ($cpt > 100) {
                $_SESSION["captcha"] = [$token => "err"];
                http_response_code(500);
                exit();
            }
            $cpt++;
            $cord = [
                @random_int(0, (CAPTCHA_WIDTH - CAPTCHA_PIECE_SIZE) / CAPTCHA_CELL_SIZE) * CAPTCHA_CELL_SIZE,
                @random_int(0, (CAPTCHA_HEIGHT - CAPTCHA_PIECE_SIZE) / CAPTCHA_CELL_SIZE) * CAPTCHA_CELL_SIZE
            ];

            foreach ($p_cord as $c) {
                if (abs($cord[0] - $c[0]) < CAPTCHA_PIECE_SIZE && abs($cord[1] - $c[1]) < CAPTCHA_PIECE_SIZE) goto main_while;
            }
            return $cord;
        }
    } catch (Exception $e) {}
}

$cords = [];

//Get base images from Picsum
$base_image = imagecreatefromjpeg('https://picsum.photos/' . CAPTCHA_WIDTH . '/' . CAPTCHA_HEIGHT);
$of_image = imagecreatefromjpeg('https://picsum.photos/' . CAPTCHA_WIDTH . '/' . CAPTCHA_HEIGHT);

$bg = imagecreatetruecolor(CAPTCHA_WIDTH + (CAPTCHA_PIECE_SIZE + CAPTCHA_CELL_SIZE * 2) * CAPTCHA_NUMBER_PIECE, CAPTCHA_HEIGHT);
imagesavealpha($bg, true);
$full_alpha = imagecolorallocatealpha($bg, 0, 0, 0, 127);
imagefill($bg, 0, 0, $full_alpha);

imagecopymerge($bg, $base_image, 0, 0, 0, 0, CAPTCHA_WIDTH, CAPTCHA_HEIGHT, 100);


for ($cpt = 0; $cpt < CAPTCHA_NUMBER_PIECE; ++$cpt) {
    $rdm_cord = get_rdm_cords($cords, $id);
    $cords[] = $rdm_cord;
    $piece = get_piece();


    for ($px = 0; $px < CAPTCHA_PIECE_SIZE; ++$px) {
        for ($py = 0; $py < CAPTCHA_PIECE_SIZE; ++$py) {
            $color = imagecolorsforindex($piece, imagecolorat($piece, $px, $py));
            // if it's not an alpha part of the mask
            if ($color['alpha'] < 63) {
                $bg_color = imagecolorat($bg, $rdm_cord[0] + $px, $rdm_cord[1] + $py);
                imagesetpixel($bg, CAPTCHA_WIDTH + $cpt * (CAPTCHA_PIECE_SIZE + CAPTCHA_CELL_SIZE * 2) + CAPTCHA_CELL_SIZE + $px, 10 + $py, $bg_color);
                $of_color = imagecolorsforindex($of_image, imagecolorat($of_image, $rdm_cord[0] + $px, $rdm_cord[1] + $py));
                imagesetpixel($bg, $rdm_cord[0] + $px, $rdm_cord[1] + $py, imagecolorallocatealpha($bg, $of_color['red'], $of_color['green'], $of_color['blue'], $of_color['alpha']));
            }
        }
    }
}

$s_cords = '';

function join_cord($c): string {
    return $c[0] . ':' . $c[1];
}

$_SESSION["captcha"] = [$id => join(':', array_map('join_cord', $cords))];

// content IMAGE
header("Content-Type: image/png");

imagepng($bg);
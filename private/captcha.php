<?php
$id = uniqid();
?>
<div id="captcha" style="
    --ns-captcha-width: <?=CAPTCHA_WIDTH?>px;
    --ns-captcha-height: <?=CAPTCHA_HEIGHT?>px;
    --ns-captcha-piece-size: <?=CAPTCHA_PIECE_SIZE?>px;
    --ns-captcha-ceil-size: <?=CAPTCHA_CELL_SIZE?>px;
    --ns-captcha-piece-count: <?=CAPTCHA_NUMBER_PIECE?>;
    ">
    <input type="hidden" name="captcha-id" value="<?=$id?>">
    <input class="captcha-input" type="hidden" name="captcha">
    <div class="captcha-view">
        <img id="captcha-img" src="/captchaGet.php?id=<?=$id?>" alt="captcha">
    </div>
    <div class="captcha-piece-storage">
        <?php
            for ($cpt = 0 ; $cpt < CAPTCHA_NUMBER_PIECE ; ++$cpt) {
                echo '<div class="captcha-piece"><img src="/captchaGet.php?id='.$id.'" alt="captcha"></div>';
            }
        ?>
    </div>
    <div id="captcha-load" style="display: none">
        <div class="spinner-border ns-text-red" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div id="captcha-error" style="display: none">
        <strong class="ns-text-red">Une erreur est survenue</strong>
        <p>Merci <button class="btn btn-secondary btn-sm" onClick="window.location.reload();">d'actualiser</button> la page pour ressayer si le probléme perciste merci de contacter une administateur.</p>
    </div>
</div>


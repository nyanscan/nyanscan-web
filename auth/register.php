<?php


$title = "Inscirption | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');

if (isset($_SESSION["account-id"])) {
    header("Location: /");
}
?>

<section id="register">
    <div class="ns-f-bg ns-f-bg-auth"></div>
    <div class="container vh-100">
        <div class="row vh-100">
            <div id="register" class="ns-theme-bg ns-theme-text rounded my-5 align-self-center col-10 offset-1 col-md-8 offset-md-2">
                <div class="container pt-5 pb-3 d-flex flex-column align-items-center justify-content-around">
                    <div class="row pb-3">
                        <a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo"></a>
                    </div>
                    <div class="row"><h2>Créer un compte</h2></div>
                    <?php
                    if (!empty($_SESSION["errors"])) {
                        echo "<div class='row rounded mt-2 ns-b-azalea ns-text-red'>";
                        foreach ($_SESSION["errors"] as $err) {
                            echo "<p class='my-1 justify-content-center'>" . $err . "</p><br>";
                        }
                        echo "</div>";
                        unset($_SESSION["errors"]);
                        $d_class = 'row col-12 col-md-10 mt-2 mb-5';
                    } else $d_class = 'row col-12 col-md-10 mt-5 mb-5';
                    ?>
                    <div class="<?php echo  $d_class ?>">
                    <form class="ns-f-wrap" method="post" action="adduser.php">
                        <div class="ns-f-w-group">
                            <label for="email">Adresse Email :</label>
                            <input id="email" class="form-control ns-form-pink" type="email" name="email" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="username">Pseudo :</label>
                        <input id="username" class="form-control ns-form-pink" type="text" name="username" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="pasword">Mot de Passe :</label>
                        <input id="pasword" class="form-control ns-form-pink" type="password" name="password" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="password-v">Confirmation Mot De Passe :</label>
                        <input id="password-v" class="form-control ns-form-pink" type="password" name="password-v" required="required">
                        </div>
                        <div class="ns-f-w-group">
                        <label for="birth">Date de Naissance :</label>
                        <input id="birth" class="form-control ns-form-pink" type="date"  name="birth" required="required">
                        </div>
                        <div class="ns-f-w-group align-self-center">
                            <div class="form-check">
                                <input id="ns-i-check-news" class="form-check-input  ns-form-check" type="checkbox" name="newsletter">
                                <label for="ns-i-check-news" class="form-check-label">NewsLetter</label>
                            </div>
                            <div class="form-check">
                                <input  id="ns-i-check-cgu" class="form-check-input ns-form-check" type="checkbox" name="cgu" required="required">
                                <label for="ns-i-check-cgu" class="form-check-label">CGU</label>
                            </div>
                        </div>
                        <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit">S'enregister</button>
                    </form>
                    </div>
                    <div class="row"><p>Tu as dèja un compte ? <a href="./">Se connecter</a></p></div>
                </div>
            </div>
        </div>
    </div>
</section>
<?php
include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
?>

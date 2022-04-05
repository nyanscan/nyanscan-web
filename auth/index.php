<?php


$title = "Connexion | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');

if (isset($_SESSION["account-id"])) {
    header("Location: /");
}
?>
    <section class="ns-f-bg">
        <div class="container vh-100">
            <div class="row vh-100">
                <div id="login" class="ns-theme-bg ns-theme-text rounded align-self-center col-10 offset-1 col-md-6 offset-md-3">
                    <div class="container pt-5 pb-3 d-flex flex-column align-items-center justify-content-around">
                        <div class="row"><h2>Se connecter</h2></div>
                        <?php
                        if (!empty($_SESSION["errors"])) {
                            echo "<div class='row rounded mt-2 ns-b-azalea ns-text-red'>";
                            foreach ($_SESSION["errors"] as $err) {
                                echo "<p class='my-1 justify-content-center'>" . $err . "</p><br>";
                            }
                            echo "</div>";
                            unset($_SESSION["errors"]);
                            echo "<div class='row col-6 mt-2 mb-5'>";
                        } else echo "<div class='row col-md-6 my-5'>";
                        ?>

                            <form method="post" action="login.php">
                                <label for="email"> Adresse e-mail :</label>
                                <input id="email" class="form-control ns-form-pink" type="email" name="user"
                                       required="required">
                                <label>
                                    Mot De Passe :
                                    <input class="form-control ns-form-pink" type="password" name="password"
                                           required="required">
                                </label>
                                <button class="form-control ns-form-pink w-75 w-md-50 mx-auto mt-4" type="submit"> Se connecter</button>
                            </form>
                        </div>
                        <div class="row"><p>Nouveaux sur NyanScan ? <a href="register.php">S'inscrire</a></p></div>
                    </div>
                </div>
            </div>
        </div>
    </section>


<?php
include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
?>
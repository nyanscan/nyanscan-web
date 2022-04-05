<?php


$title = "Connexion | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');

if (isset($_SESSION["account-id"])) {
    header("Location: /");
}
?>

    <?php
    if (!empty($_SESSION["errors"])) {
        echo "<div>";
        foreach ($_SESSION["errors"] as $err) {
            echo "<span>".$err."</span><br>";
        }
        echo "</div>";
        unset($_SESSION["errors"]);
    }
    ?>
    <div id="login" style="background-color: darkcyan">
        <form method="post" action="login.php">
            <input  class="form-control" type="email" name="user" placeholder="Adresse mail" required="required">
            <input  class="form-control" type="password" name="password" placeholder="mot de passe" required="required">
            <button  class="form-control" type="submit"> Connexion </button>
        </form>
    </div>

<?php
include ($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
?>
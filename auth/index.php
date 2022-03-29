<!DOCTYPE html>
<?php
session_start();
if (isset($_SESSION["account-id"])) {
    header("Location: /");
}
?>
<html>
<head>
    <meta charset="UTF-8">
    <title>Connection | NyanScan</title>
    <link rel="stylesheet" type="text/css" href="../css/nyanscan.css">
</head>
<body>
    <?php
    include ($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');
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
            <input type="email" name="user" placeholder="Adresse mail" required="required">
            <input type="password" name="password" placeholder="mot de passe" required="required">
            <button type="submit"> Connexion </button>
        </form>
    </div>
    <div id="register">
        <form method="post" action="register.php">
            <input type="text" name="username" placeholder="Nom d'utilisateur" required="required">
            <input type="email" name="email" placeholder="Adresse mail" required="required">
            <input type="password" name="password" placeholder="mot de passe" required="required">
            <input type="password" name="password-v" placeholder="verification" required="required">
            <label>
                News Letter:
                <input type="checkbox" name="newsletter">
            </label>
            <label>
                CGU:
                <input type="checkbox" name="cgu" required="required">
            </label>
            <button type="submit">S'enregister</button>
        </form>
    </div>
    <?php
    include ($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
    ?>
</body>
</html>
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
        echo "<span>".$err."</span>";
    }
    echo "</div>";
    unset($_SESSION["errors"]);
}
?>
<div>
    Votre compte à bien était créee vous pouvez vous connecter maintant en clicant ici : <a href="index.php"> Connexion </a>
</div>
<?php
include ($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
?>
</body>
</html>
<!DOCTYPE html>
<?php
if (isset($_SESSION["account-id"])) {
    header("Location: /");
}
?>
<html>
<head>
    <meta charset="UTF-8">
    <title>Connexion | NyanScan</title>
    <link rel="stylesheet" type="text/css" href="../css/nyanscan.css">
</head>
<body>
<?php
include($_SERVER['DOCUMENT_ROOT'] . '/private/components/nav.php');
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
    Votre compte a bien été créé. Vous pouvez vous connecter maintenant en cliquant ici : <a href="index.php"> Connexion </a>
</div>
<?php
include($_SERVER['DOCUMENT_ROOT'] . '/private/components/footer.php');
?>
</body>
</html>
<?php


$title = "Inscirption | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');

if (isset($_SESSION["account-id"])) {
    header("Location: /");
}
?>

<div id="register" class="ns-f-bg">
    <form method="post" action="adduser.php">
        <input class="form-control" type="text" name="username" placeholder="Nom d'utilisateur" required="required">
        <input class="form-control"  type="email" name="email" placeholder="Adresse mail" required="required">
        <input class="form-control"  type="password" name="password" placeholder="mot de passe" required="required">
        <input class="form-control"  type="password" name="password-v" placeholder="verification" required="required">
        <label>
            News Letter:
            <input class="form-control"  type="checkbox" name="newsletter">
        </label>
        <label>
            CGU:
            <input class="form-control"  type="checkbox" name="cgu" required="required">
        </label>
        <button class="form-control"  type="submit">S'enregister</button>
    </form>
</div>
<?php
include ($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
?>

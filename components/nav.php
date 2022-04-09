<?php
include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');
?>

<header>
    <nav id="ns-nav" class="">
        <div class="ns-nav-part">
            <a href="/"><img class="ns-logo" src="../res/logo-ns.png" alt="nyanscan-logo"></a>
            <a class="ns-a-1" href="/catalogue.php">Catalogue</a>
        </div>
        <div class="ns-nav-part justify-content-center">
            <form class="form-inline w-100">
                <input class="ns-search" id="ns-nav-search" type="search" placeholder="Rechercher...">
            </form>
        </div>
        <div class="ns-nav-part">
            <div class="form-check form-switch">
                <input class="form-check-input ns-them-check" type="checkbox" role="switch">
            </div>
            <a class="ns-a-1" href="/auth">Se Connecter</a>

        </div>
    </nav>
    <?php
        if (isset($_SESSION["account-username"])) {

            echo "Username : " . $_SESSION["account-username"];
            echo "<a href=\"/auth/logout.php\">Deconexion</a>";
        } else {
            echo "<a href='/auth'>Conexion</a>";
        }
    ?>
</header>
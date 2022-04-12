<?php
if (!($noheader??false))
    require($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');
if (!($noFunction??false))
    require($_SERVER['DOCUMENT_ROOT'] . '/utils/functions.php');
?>

<header class="sticky-top">
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
                <input id="ns-theme-toggle" class="form-check-input ns-them-check" type="checkbox" role="switch">
            </div>
            <?php
            if (isConnected())
                echo "<a class='ns-a-1' href='/auth/logout.php'>Se Deconnecter</a>";
            else
                echo "<a class='ns-a-1' href='/auth'>Se Connecter</a>";
            ?>
        </div>
    </nav>
</header>
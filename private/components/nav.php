<?php
if (!($noheader??false))
    require($_SERVER['DOCUMENT_ROOT'] . '/private/components/header.php');
if (!($noFunction??false))
    require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

$scripts = ["toggler.js"]
?>

<header class="sticky-top">
    <nav id="ns-nav" class="navbar navbar-expand-lg">
        <div class="ns-nav-part">
            <a href="/"><img class="ns-logo" src="../../res/logo-ns.png" alt="nyanscan-logo"></a>
        </div>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle Navigation">
            <i class="fas fa-solid fa-paw"></i>
        </button>


            <div class="ns-nav-part collapse navbar-collapse" id="navbarResponsive">
                <a class="ns-a-1" href="/catalogue.php">Catalogue</a>
            </div>
            <div class="ns-nav-part justify-content-center collapse navbar-collapse" id="navbarResponsive">
                <form class="form-inline w-100">
                    <input class="ns-search" id="ns-nav-search" type="search" placeholder="Rechercher...">
                </form>
            </div>
            <div class="ns-nav-part collapse navbar-collapse" id="navbarResponsive">
                <div class="form-check form-switch">
                    <input id="ns-theme-toggle" class="form-check-input ns-them-check" type="checkbox" role="switch">
                </div>
                <?php
                if (isConnected()){
                    echo "<a class='ns-a-1' href='/u/profile.php'>Profil</a>";
                    echo "<a class='ns-a-1' href='/auth/logout.php'>Se Deconnecter</a>";
                }
                else{
                    echo "<a class='ns-a-1' href='/auth'>Se Connecter</a>";
                }
                ?>
            </div>

    </nav>
</header>
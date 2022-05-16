<?php
if (!($noheader??false))
    require($_SERVER['DOCUMENT_ROOT'] . '/private/components/header.php');
if (!($noFunction??false))
    require($_SERVER['DOCUMENT_ROOT'] . '/private/utils/functions.php');

$scripts = ["toggler.js"]
?>

<header class="sticky-top">
    <nav id="mainNav" class="navbar navbar-expand-md"> <!--ns-nav -->
        <div class="container-fluid px-4 px-md-5">
            <a href="/" class="navbar-brand ps-2"><img src="../../res/logo-ns.png" alt="nyanscan-logo" width="38"></a> <!--class="ns-nav-logo"-->
            <!--<div class="ns-nav-part">
                </div>-->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle Navigation">
                <svg class="svg-inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                    <path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/>
                </svg>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive"> <!--ns-nav-part -->
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <a class="ns-a-1 nav-link" href="/catalogue.php">Catalogue</a>
                    </li>
                </ul>
                <form class="justify-content-center form-inline w-75">
                    <input class="ns-search" id="ns-nav-search" type="search" placeholder="Rechercher...">
                </form>
                <div class="form-check form-switch">
                    <input id="ns-theme-toggle" class="form-check-input ns-them-check" type="checkbox" role="switch">
                </div>
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle Navigation">
                <span class="ns-menu-profil img-circle img-responsive"></span>
            </button>
            <div>
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <?php
                    if (isConnected()){
                        echo "<li class='nav-item'><a class='ns-a-1 nav-link' href='/u/me'>Profil</a></li>";
                        echo "<li class='nav-item'><a class='ns-a-1 nav-link' href='/auth/logout.php'>Se&nbsp;Deconnecter</a></li>";
                    }
                    else{
                        echo "<li class='nav-item'><a class='ns-a-1 nav-link' href='/auth'>Se&nbsp;Connecter</a></li>";
                    }
                    ?>
                </ul>
            </div>
        </div>
    </nav>
</header>
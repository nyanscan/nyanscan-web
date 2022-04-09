<?php
    include($_SERVER['DOCUMENT_ROOT'] . '/components/nav.php');
?>

<section class="ns-min-vh-100 ns-theme-bg">

</section>
<section class="ns-min-vh-100 ns-theme-bg">

</section>
<section class="ns-min-vh-100">
    <h1>NyanScan</h1>
    <p>NyanScan est un site de lecture de scan en ligne Avec son moteur de recherche complet, trouve le manga qui te plait en quelque clic !</p>
    <form class="form-inline w-100">
        <input class="ns-search" id="ns-nav-search" type="search" placeholder="Rechercher...">
    </form>
    <span>OU</span>
    <a href="auth">Se connecter</a>
</section>
<section class="ns-min-vh-50 ns-theme-bg">
    <h3>Tu souhaites nous reejoindres ? </h3>
    <form action="" method="post" class="form-inline">
        <input type="email" placeholder="Entre ton amil">
        <button type="submit"> Rejoindre </button>
    </form>
</section>

<?php
include ($_SERVER['DOCUMENT_ROOT'] . '/components/foot.php');
?>

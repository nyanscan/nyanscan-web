<?php


$title = "Inscirption | NyanScan";
include($_SERVER['DOCUMENT_ROOT'] . '/components/header.php');

if (isset($_SESSION["account-id"])) {
    header("Location: /");
}
?>

<section id="register">
    <div class="ns-f-bg ns-f-bg-err"></div>
    <div class="container vh-100">
        <div class="row vh-100">
            <div id="error" class="ns-theme-bg ns-theme-text rounded-3 my-5 align-self-center col-10 offset-1 col-md-8 offset-md-2">
                <div class="ns-center w-100 h-100 flex-row flex-wrap">
                    <div class="w-100 ns-center"><a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo"></a></div>
                    <h1 class="w-auto my-5 me-lg-5 w-25" >404</h1>
                    <p class="w-75 w-lg-50">Oops, la page que vours recherchez n'est poas disponible ou à été déplacé.</p>
                    <div class="w-100 ns-center"><p>Retourner à la <a href="/">page d'accueil</a></p></div>
                </div>
            </div>
        </div>
    </div>
</section>
<?php
include($_SERVER['DOCUMENT_ROOT'] . '/components/footer.php');
?>

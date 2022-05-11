<?php
    include($_SERVER['DOCUMENT_ROOT'] . '/private/components/nav.php');
    $scripts = ["carousel.js"]
?>

<section class="ns-theme-bg py-5">
    <div class="ns-carousel">
        <div class="ns-carousel-images">
            <img src="res/banner/b1.jpg">
            <img src="res/banner/b2.jpg">
            <img src="res/banner/b3.jpeg">
            <img src="res/banner/b1.jpg">
        </div>
        <div class="ns-carousel-points">
        </div>
    </div>
</section>
<section class="ns-min-vh-100 ns-theme-bg">
    <div class="ns-min-vh-50 ns-center pb-5">
        <div class="ns-scan-preview">
            <h3 class="ns-scan-preview-tile">Scan les plus populaires</h3>
            <div class="ns-scan-preview-elements">
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
            </div>
        </div>
    </div>
    <div class="ns-min-vh-50 ns-center pb-5">
        <div class="ns-scan-preview">
            <h3 class="ns-scan-preview-tile">Les exclu NyanScan</h3>
            <div class="ns-scan-preview-elements">
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
            </div>
        </div>
    </div>
    <div class="ns-min-vh-50 ns-center pb-5">
        <div class="ns-scan-preview">
            <h3 class="ns-scan-preview-tile">Les coups de cœur de la rédaction</h3>
            <div class="ns-scan-preview-elements">
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="ns-min-vh-100 ns-violet-blue-bg p-5 d-flex flex-column align-items-center justify-content-evenly">
    <h1 class="ns-text-red fw-bold">NyanScan</h1>
    <p class="text-white ns-fs-5 w-lg-25 w-75 text-center">NyanScan est un site de lecture de scan en ligne. Avec son moteur de recherche complet, trouve le manga qui te plait en quelque clic !</p>
    <form class="form-inline w-lg-40 w-75 ns-fs-4">
        <input class="ns-search w-100 p-4" id="ns-nav-search" type="search" placeholder="Rechercher...">
    </form>
    <span class="text-white ns-fs-3 fw-bold">OU</span>
    <a class="btn text-black ns-fs-4 ns-tickle-pink-btn" href="auth">Se connecter</a>
</section>
<section class="ns-min-vh-50 ns-theme-bg ns-theme-text d-flex flex-column align-items-center justify-content-around p-5">
    <h3>Tu souhaites nous rejoindre ?</h3>
    <form action="" method="post" class="form-inline ns-news-form w-100 container-lg">
        <div class="row">
            <div class="d-none d-lg-block col-lg-3"></div>
            <div class="col-lg-6 mb-5 mb-lg-0"><input class="ns-news-input w-100" type="email" placeholder="Entre ton mail"></div>
            <div class="col-lg-auto ns-center"><button class="ns-news-btn" type="submit"> Rejoindre </button></div>
            <div class="d-none d-lg-block col-lg"></div>
        </div>
    </form>
</section>

<?php
include($_SERVER['DOCUMENT_ROOT'] . '/private/components/foot.php');
?>

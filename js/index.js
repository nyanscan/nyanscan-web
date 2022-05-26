class Footer extends Component {

    get raw() {
        return `
<footer class="w-100 p-0 m-0">
    <div id="ns-footer">
        <div id="ns-footer-logo">
            <ns-a href="/" class="ns-a-clear">
                <img class="ns-logo" src="../res/logo-ns.png" alt="nyanscan-logo">
                <div>
                    <h3>NyanScan</h3>
                    <p>Ton site de scan préféré</p>
                </div>
            </ns-a>
        </div>
        <div id="ns-footer-link">
            <a href="/">Mon compte</a>
            <a href="/">Tendance</a>
            <a href="/">Catalogue</a>
            <a href="/">A propos</a>
            <a href="/">Contact</a>
            <a href="/">FAQ</a>
            <a href="/">Plan du site</a>
            <a href="/">RGPD</a>
            <a href="/">CGU</a>
            <a href="/">Politique des Cookies</a>
        </div>
        <div id="ns-footer-social">
            <a href="/" class="ns-a-clear">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="ns-pict px-2">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
            </a>
            <a href="/" class="ns-a-clear">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="ns-pict px-2">
                    <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
                </svg>
            </a>
            <a href="/" class="ns-a-clear">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ns-pict px-2">
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
                </svg>
            </a>
        </div>
        <div id="ns-footer-copyright"><span class="text-black">Copyright© NyanScan 2022</span></div>
    </div>
</footer>
        `
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_FOOTER);
    }

}

class Header extends Component {
    get raw() {
        return `
<header class="sticky-top">
 <nav id="mainNav" class="navbar navbar-expand-md"> <!--ns-nav -->
        <div class="container-fluid px-4 px-md-5">
            <ns-a href="/" class="navbar-brand ps-2"><img src="../res/logo-ns.png" alt="nyanscan-logo" width="38"></ns-a> <!--class="ns-nav-logo"-->
            <!--<div class="ns-nav-part">
                </div>-->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle Navigation">
                <svg class="svg-inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                    <path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/>
                </svg>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive"> <!--ns-nav-part -->
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item me-5">
                        <ns-a  class="ns-a-1" href="/forum">Forum</ns-a>
                    </li>
                    <li class="nav-item">
                        <ns-a  class="ns-a-1" href="/publish">Publier</ns-a>
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
                <ul id="ns-h-log" class="navbar-nav me-auto mb-2 mb-md-0">
                </ul>
            </div>
        </div>
    </nav>
</header>
        `
    }

    getHTML() {
        return super.getHTML();
    }

    updateLogStatus() {
        const login = _('#ns-h-log')
        if (!login) return;
        login.innerHTML = null;
        if (this.app.user.isLog) {
            login.innerHTML = "<li class='nav-item'><ns-a class='ns-a-1 nav-link' href='/u/me'>Profil</ns-a></li>";
            const logout = create('li', null, login, 'nav-item');
            const btn = create('span', null, logout, 'ns-a-1', 'nav-link');
            btn.addEventListener('click', this.app.user.logout.bind(this.app.user, true));
            btn.innerText = 'Se Déconnecter';

        } else {
            login.innerHTML = "<li class='nav-item'><ns-a class='ns-a-1 nav-link' href='/auth'>Se Connecter</ns-a></li>"
        }
    }

    build(parent) {
        super.build(parent);
        registerToggle(_('#ns-theme-toggle'));
        this.updateLogStatus();
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_FOOTER);
        app.addEventListener('log', this.updateLogStatus.bind(this));
        app.addEventListener('logout', this.updateLogStatus.bind(this));
    }

}

class Index extends Pages {

    get raw() {
        return `
        <section class="ns-theme-bg py-5">
    <div class="ns-carousel">
        <div class="ns-carousel-images">
            <img src="/res/banner/b1.jpg">
            <img src="/res/banner/b2.jpg">
            <img src="/res/banner/b3.jpeg">
            <img src="/res/banner/b1.jpg">
        </div>
        <div class="ns-carousel-points">
        </div>
    </div>
</section>
<section class="ns-min-vh-100 ns-theme-bg ns-text-black">
    <div class="ns-min-vh-50 ns-center pb-5">
        <div class="ns-scan-preview">
            <h3 class="ns-scan-preview-tile">Scan les plus populaires</h3>
            <div class="ns-scan-preview-elements">
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
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
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
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
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
                <div class="ns-scan-preview-component">
                    <a href="/">
                        <img src="/res/book/love-is-war.jpg">
                    </a>
                    <span>Love Is War</span>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="min-vh-100 ns-violet-blue-bg p-5 d-flex flex-column align-items-center justify-content-evenly">
    <h1 class="ns-text-red fw-bold">NyanScan</h1>
    <p class="text-white ns-fs-5 w-lg-25 w-75 text-center">NyanScan est un site de lecture de scan en ligne. Avec son moteur de recherche complet, trouve le manga qui te plait en quelque clic !</p>
    <form class="form-inline w-lg-40 w-75 ns-fs-4">
        <input class="ns-search w-100 p-4" id="ns-nav-search" type="search" placeholder="Rechercher...">
    </form>
    <span class="text-white ns-fs-3 fw-bold">OU</span>
<!-- Todo: change this -->
    <a class="btn text-black ns-fs-4 ns-tickle-pink-btn" href="auth">Se connecter</a>
</section>
<section class="ns-min-vh-50 ns-theme-bg ns-theme-text d-flex flex-column align-items-center justify-content-around p-5">
    <h3>Tu souhaites nous rejoindre ?</h3>
    <form action="auth/register.php" method="get" class="form-inline ns-news-form w-100 container-lg">
        <div class="row">
            <div class="d-none d-lg-block col-lg-3"></div>
            <div class="col-lg-6 mb-5 mb-lg-0"><input class="ns-news-input w-100" type="email" name="email" placeholder="Entre ton amil"></div>
            <div class="col-lg-auto ns-center"><button class="ns-news-btn" type="submit"> Rejoindre </button></div>
            <div class="d-none d-lg-block col-lg"></div>
        </div>
    </form>
</section>
        `
    }

    build(parent, vars) {
        super.build(parent, vars);
        setupCarousel(_('.ns-carousel', true));
    }

    constructor(app) {
        super(app);
    }
}

const STRUCTURE = [
    {
        re: /^(|index|home)$/,
        rel: "index",
    },
    {
        re: /^(f|forum)(\/.*)?$/,
        child: {
            path_var: [2],
            elements: [
                {
                    re: /^(|categories)$/,
                    rel: 'forum/categories'
                },
                {
                    re: /^([0-9]+)$/,
                    rel: 'forum/category',
                    var: [{id: 1, name: 'category'}]
                },
                {
                    re: /^([0-9]+)\/([0-9]+)\/?([0-9]*)/,
                    rel: 'forum/topic',
                    var: [{id: 1, name: 'category'}, {id: 2, name: 'topic'}, {id: 3, name: 'page'}]
                }
            ]
        }
    },
    {
        re: /^(user|u|profil|profile)\/([a-zA-Z0-9]+)(\/.*)?$/,
        var: [{id: 2, name: 'user'}],
        child: {
            path_var: [3],
            elements: [
                {
                    re: /^$/,
                    rel: "user"
                },
                {
                    re: /^(projet|project)$/,
                    rel: "reading/userProject"
                }
            ]
        }
    },
    {
        re: /^auth(\/.*)?$/,
        child: {
            path_var: [1],
            elements: [
                {
                    re: /^(|login)$/,
                    rel: 'auth/login',
                    loginLevel: LOGIN_LEVEL_DISCONNECT,
                },
                {
                    re: /^wait-verification$/,
                    rel: 'auth/loginSuccess',
                    loginLevel: LOGIN_LEVEL_DISCONNECT,
                },
                {
                    re: /^register$/,
                    rel: 'auth/register',
                    loginLevel: LOGIN_LEVEL_DISCONNECT,
                },
                {
                    re: /^verification-success$/,
                    rel: 'auth/verificationSuccess'
                },
                {
                    re: /^verification-failed$/,
                    rel: 'auth/verificationFail'
                }
            ]
        }
    },
    {
        re: /^publish$/,
        rel: "reading/publish",
        // loginLevel: LOGIN_LEVEL_CONNECT,
    },
    {
        re: /^p\/([0-9]+)(?:\/(.*))?$/,
        var: [{id: 1, name: 'project'}],
        child: {
            path_var: [2],
            elements: [
                {
                    re: /^(|view)$/,
                    rel: 'reading/project'
                },
                {
                    re: /^(edit)$/,
                    rel: 'reading/addChapter'
                },
                {
                    re: /^([0-9]+)(?:\/([0-9]+))?$/,
                    rel: 'reading/reader',
                    var: [{id: 1, name: 'volume'}, {id: 2, name: 'page'}]
                }
            ]
        }
    }
]

export const APP = new Application(Header, Footer, Index, Error404, STRUCTURE, '');
window.APP = APP;



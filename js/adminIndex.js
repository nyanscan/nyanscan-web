class Footer extends Component {

    build(parent) {}
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
        admin
        `
    }

    build(parent, vars) {
        super.build(parent, vars);
    }

    constructor(app) {
        super(app);
    }
}

const STRUCTURE = [
    {
        re: /^(|index|home)$/,
        rel: "index",
        loginLevel: LOGIN_LEVEL_CONNECT,
    },
]

export const APP = new Application(Header, Footer, Index, Error404, STRUCTURE, 'admin');
window.APP = APP;
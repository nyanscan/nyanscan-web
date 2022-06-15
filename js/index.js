console.log("/!\\ Attend ! Tu ne devrais pas toucher quoique ce soit ici !\nSi tu sais vraiment ce que tu fais, l'ESGI devrait être pas trop mal pour toi~ /!\\");

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
                    <a href="/">Catalogue</a>
                    <a href="/">A propos</a>
                    <a href="/">Contact</a>
                    <a href="/">FAQ</a>
                    <a href="/">RGPD</a>
                    <a href="/">CGU</a>
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
    nav;
    lastSearchTime = 0;
    lastSearchValue = '';
    searchForm;
    searchInput;
    searchRes;

    get raw() {
        return `
        <nav id="mainNav">
            <div id="ns-main-burger" class="d-lg-none">
               <div class="ns-burger mx-auto">
               
                </div>
            </div>
            <div class="d-flex gap-3 justify-content-center align-items-center">
                <ns-a href="/" class=""><img src="../res/logo-ns.png" alt="nyanscan-logo" width="38"></ns-a>
                <ns-a  class="ns-a-1 ns-d-none-mlg" href="/forum">Forum</ns-a>
                <ns-a  class="ns-a-1 ns-hide-disconnected ns-d-none-mlg" href="/publish">Publier</ns-a>
            </div>
            <div>
                <form id="ns-search" class="justify-content-center form-inline ns-form-search">
                    <input class="ns-search" id="ns-nav-search" type="search" placeholder="Rechercher...">
                    <div class="ns-search-result">
                        <ul>
                        
                        </ul>
                    </div>
                </form>
            </div>
            <div class="form-check form-switch ns-d-none-mlg">
                <input id="ns-theme-toggle" class="form-check-input ns-them-check mx-auto" type="checkbox" role="switch">
            </div>
            <div class="ns-d-none-mlg">
               <ns-a class='ns-a-1 nav-link ns-hide-connected' href='/auth'>Se Connecter</ns-a>
               <span class='ns-a-1 nav-link ns-hide-disconnected d-inline' onclick="window.APP.user.logout(true)">Se Déconnecter</span>
               <ns-a class="ns-hide-disconnected d-inline" href='/u/me'><img src="/res/profile.webp" alt="profilePhoto" class="ns-avatar img-circle img-responsive ns-avatar-sm"></ns-a>
            </div>
        </nav>  
        <nav id="horizontal-mobile-nav" style="display: none">
            <div id="horizontal-mobile-nav-container">
                <button type="button" id="ns-mobile-nav-close" class="btn-close ns-modal-cancel-btn" data-ns-modal="ns-modal" aria-label="Close"></button>
                <ul id="horizontal-mobile-nav-ul">
                    <span>NyanScan</span>
                    <li>
                        <ns-a class="ns-a-1" href="/forum">Forum</ns-a>
                    </li>
                    <li class="ns-hide-disconnected">
                        <ns-a  class="ns-a-1" href="/publish">Publier</ns-a>
                    </li>
                    <li class="ns-hide-connected">
                        <ns-a class='ns-a-1' href='/auth'>Se Connecter</ns-a>
                    </li>
                    <li class="ns-hide-disconnected">
                        <span class='ns-a-1' onclick="window.APP.user.logout(true)">Se Déconnecter</span>
                    </li>
                    <li class="ns-hide-disconnected">
                        <ns-a class="d-inline" href='/u/me'><img src="/res/profile.webp" alt="profilePhoto" class="ns-avatar img-circle img-responsive ns-avatar-sm"></ns-a>
                    </li>
                    <li>
                        <div class="form-check form-switch">
                            <input id="ns-theme-toggle-mobile" class="form-check-input ns-them-check" type="checkbox" role="switch">
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
        `
    }

    getHTML() {
        return super.getHTML();
    }

    updateLogStatus() {

        const login = _('#ns-h-log')
        if (!login) {
            return;
        }
        login.innerHTML = null;
        if (this.app.user.isLog) {
            login.innerHTML = "<li class='nav-item'><ns-a class='ns-a-1 nav-link' href='/u/me'>Profil</ns-a></li>";
            const logout = create('li', null, login, 'nav-item');
            const btn = create('span', null, logout, 'ns-a-1', 'nav-link');
            btn.addEventListener('click', this.app.user.logout.bind(this.app.user, true));
            btn.innerText = 'Se Déconnecter';
        } else {
            login.innerHTML = "<ns-a class='ns-a-1 nav-link' href='/auth'>Se Connecter</ns-a>"
        }
    }

    build(parent) {
        //console.log('build');
        super.build(parent);
        registerToggle(_('#ns-theme-toggle'));
        registerToggle(_('#ns-theme-toggle-mobile'));
        this.updateLogStatus();
        this.searchForm = _('#ns-search');
        this.searchInput = _('#ns-nav-search');
        this.searchRes = _('#ns-nav-search + .ns-search-result > ul', true);
        this.nav = _('#mainNav');
        this.searchInput.addEventListener('input', this.search.bind(this));

        _('#ns-main-burger').addEventListener('click', (e) => {
            const current = _('#horizontal-mobile-nav').style.display === 'none';
            _('#horizontal-mobile-nav').style.display = current ? 'block' : 'none';
        }, true);

        _('#ns-mobile-nav-close').addEventListener('click', () => {_('#horizontal-mobile-nav').style.display = 'none'});
        _('#horizontal-mobile-nav').addEventListener('click', (e) => { if(e.target && e.target.id === 'horizontal-mobile-nav') _('#horizontal-mobile-nav').style.display = 'none'});
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_FOOTER);
        app.addEventListener('log', this.updateLogStatus.bind(this));
        app.addEventListener('logout', this.updateLogStatus.bind(this));
    }

    search() {
        const v = this.searchInput.value;
        if (v.length === 0) {
            this.lastSearchValue = '';
            this.searchRes.innerHTML = '';
        } else if (v !== this.lastSearchValue) {
            this.lastSearchValue = v;
            sendApiGetRequest(`search?v=${encodeURIComponent(v)}&short=1`, this.searchResult.bind(this));
        }
    }

    openBurger() {
        _('#horizontal-mobile-nav').style.display = '';
    }

    searchResult(e) {
        if (checkApiResStatus(e) === API_REP_OK) {
            const data = getDataAPI(e);
            this.searchRes.innerHTML = '';

            for (const cat of [{id: 'user', display: "Membre", href: '/u/', field: 'username'}, {id: 'project', display: 'Projet', href: '/p/', field: 'title'}]) {
                if (data[cat.id] !== undefined && data[cat.id].length > 0) {
                    const li = create('li', null, this.searchRes, 'ns-search-category');
                    createPromise('span', null, li).then(e => e.innerText = cat.display);
                    const ul = create('ul', null, li);
                    for (const el of data[cat.id]) {
                        const elli = create('li', null, ul);
                        createPromise('ns-a', null, elli).then(e => {
                            e.innerText = el[cat.field];
                            e.href = cat.href + el['id'];
                        })
                    }
                }
            }
        }
    }
}

class Index extends Pages {

    data;
    fame;
    last;
    love;

    get raw() {
        return `
        <section class="ns-theme-bg py-5">
            <div class="ns-carousel">
                <div class="ns-carousel-images">
                    <img src="/res/banner/b1.jpg" alt="">
                    <img src="/res/banner/b2.jpg" alt="">
                    <img src="/res/banner/b3.jpeg" alt="">
                    <img src="/res/banner/b1.jpg" alt="">
                </div>
                <div class="ns-carousel-points">
                
                </div>
            </div>
        </section>
        <section class="ns-min-vh-100 ns-theme-bg ns-text-black">
            <ns-api-data-block id="ns-index-data" href="project/index">
                <div class="ns-min-vh-50 ns-center pb-5">
                    <div class="ns-scan-preview">
                        <h3 class="ns-scan-preview-tile">Scan les plus populaires</h3>
                        <div class="overflow-auto w-100 pb-2">
                            <div id="ns-index-fame" class="ns-scan-preview-elements">
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span><span class="placeholder w-75"></span></span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ns-min-vh-50 ns-center pb-5">
                    <div class="ns-scan-preview">
                        <h3 class="ns-scan-preview-tile">Dernière publication</h3>
                        <div class="overflow-auto w-100 pb-2">
                            <div id="ns-index-last" class="ns-scan-preview-elements">
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ns-min-vh-50 ns-center pb-5">
                    <div class="ns-scan-preview">
                        <h3 class="ns-scan-preview-tile">Les coups de cœur de la rédaction</h3>
                        <div class="overflow-auto w-100 pb-2">
                            <div class="ns-scan-preview-elements" id="ns-index-love">
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                                <div class="ns-scan-preview-component placeholder-glow">
                                    <ns-a href="/">
                                        <span class="ns-scan-preview-component-placeholder placeholder w-100 ns-b-purple-gradient"></span>
                                    </ns-a>
                                    <span>
                                        <span class="placeholder w-75"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    </ns-api-data-block>
</section>
<section class="min-vh-100 ns-violet-blue-bg p-5 d-flex flex-column align-items-center justify-content-evenly">
    <h1 class="ns-text-red fw-bold">NyanScan</h1>
    <p class="text-white ns-fs-5 w-lg-25 w-75 text-center">NyanScan est un site de lecture de scan en ligne. Avec son moteur de recherche complet, trouve le manga qui te plait en quelque clic !</p>
    <form class="form-inline w-lg-40 w-75 ns-fs-4">
        <input class="ns-search w-100 p-4" id="ns-nav-search" type="search" placeholder="Rechercher...">
    </form>
    <span class="text-white ns-fs-3 fw-bold ns-hide-connected">OU</span>
    <a class="btn text-black ns-fs-4 ns-tickle-pink-btn ns-hide-connected" href="auth">Se connecter</a>
</section>
<section class="ns-min-vh-50 ns-theme-bg ns-theme-text d-flex flex-column align-items-center justify-content-around p-5">
    <h3>Tu souhaites nous rejoindre ?</h3>
    <form id="ns-index-join" class="form-inline ns-news-form w-100 container-lg">
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

        this.data = _('#ns-index-data');
        const join = _('#ns-index-join');
        if (join) join.addEventListener('submit', ((e) => {
            console.log(e);
            e.preventDefault();
            window.APP.session['register_email'] = join.querySelector('.ns-news-input').value;
            window.APP.changePage('/auth/register');
        }))

        if (this.data.dataLoad) {
            this.updateSelection();
        }
        this.data.addEventListener('dataLoad', this.updateSelection.bind(this));
    }

    updateSelection() {
        if (this.data.isError) {
            return;
        }

        for (const rawDataKey in this.data.rawData) {
            const e = _('#ns-index-' + rawDataKey);
            if (e) {
                e.innerHTML = '';
                for (let item of this.data.rawData[rawDataKey]) {
                    const box = create('div', null, e, 'ns-scan-preview-component');
                    const ns_a = create('ns-a', null, box);
                    ns_a.href = '/p/' + item['id'];
                    const img = create('img', null, ns_a);
                    img.src = image_id_to_patch(item['picture']);
                    const span = create('span', null, box)
                    span.innerText = item['title'];
                }
            }
        }
    }

    get_client_url() {
        return '/index';
    }

    constructor(app) {
        super(app);
    }
}

const STRUCTURE = [
    {
        re: /^test-text$/,
        rel: 'text'
    },
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
                    re: /^([0-9]+)(?:\/([0-9]+)?)?$/,
                    rel: 'reading/reader',
                    var: [{id: 1, name: 'volume'}, {id: 2, name: 'page'}]
                }
            ]
        }
    }
]

export const APP = new Application(Header, Footer, Index, Error404, STRUCTURE, '');
window.APP = APP;
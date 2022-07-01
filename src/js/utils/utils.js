const COMPONENT_TYPE_HEADER = 0;
const COMPONENT_TYPE_FOOTER = 1;
const COMPONENT_TYPE_PAGE = 2;
const COMPONENT_TYPE_FLOAT = 3;
const COMPONENT_TYPE_MODAL = 4;
const COMPONENT_TYPE_TOAST = 5;
const API_REP_OK = 1;
const API_REP_BAD = 0;
const API_REP_CONNECTION_ERROR = -1;
const LOGIN_LEVEL_DISCONNECT = -1;
const LOGIN_LEVEL_CONNECT = 1;

const TYPE_SUCCESS = 0;
const TYPE_INFO = 1;
const TYPE_WARN = 2;
const TYPE_ERROR = 3;

const VERSION = 'BETA-2.1.2';

//Kind of a selector function :
//to select html tag
//Query is the tag
//Mono tell it has to be an isolated element or not
//return either the first html element or a list of matching elements
function _(query, mono=false) {
    if (query.startsWith('#') && !query.includes(' ')) {
        mono = true;
    }
    if (mono) {
        return document.querySelector(query);
    }
    return document.querySelectorAll(query);
}

//Function that create html element
//type is tag type, id like the id, parent like the parent tag
//and class where you can give class as much as you want
//return the created element
function create(type, id = null, parent = null, ...cla) {
    const e = document.createElement(type);
    if (cla.length > 0) {
        e.classList.add(...cla);
    }
    if (id) {
        e.id = id;
    }
    if (parent) {
        parent.appendChild(e);
    }
    return e;
}

//Same as above but with a Promise
function createPromise(type, id = null, parent = null, ...cla) {
    return new Promise(resolve => {
        const e = document.createElement(type);
        if (cla.length > 0) {
            e.classList.add(...cla);
        }
        if (id) {
            e.id = id;
        }
        if (parent) {
            parent.appendChild(e);
        }
        resolve(e);
    });
}

/**
 * Function to send POST request
 * with the formData for this one for more context
 * @param url
 * @param formData
 * @param callBack
 * @param progressCallBack
 * not deprecated for progressCallBack
 */
function sendApiPostRequest(url, formData, callBack = null, progressCallBack = null) {
    sendApiRequest("POST", url, callBack, progressCallBack, formData);
}

/**
 * Function to send GET request
 * @param url
 * @param callBack
 * @param progressCallBack
 * @deprecated
 */
function sendApiGetRequest(url, callBack = null, progressCallBack = null) {
    sendApiRequest("GET", url, callBack, progressCallBack);
}

/**
 * Function to send DELETE request
 * @param url
 * @param callBack
 * @param progressCallBack
 * @deprecated
 */
function sendApiDeleteRequest(url, callBack = null, progressCallBack = null) {
    sendApiRequest("DELETE", url, callBack, progressCallBack);
}

/**
 * Function that send the request
 * with the method to use, the url, the callback and the item to send
 * @param method
 * @param url
 * @param callBack
 * @param progressCallBack
 * @param sendItem
 */
function sendApiRequest(method, url, callBack, progressCallBack = undefined, sendItem = undefined) {
    const ajax = new XMLHttpRequest()
    ajax.open(method, `/api/v1/${url}`, true);
    let auth = window.APP.user.authorization;
    if (auth !== null) ajax.setRequestHeader('Authorization', auth );

    if (progressCallBack !== undefined && progressCallBack !== null) {
        ajax.upload.addEventListener('progress', progressCallBack);
    }

    if (callBack !== null && callBack !== undefined) {
        ajax.addEventListener("error", callBack);
        ajax.addEventListener("abort", callBack);
        ajax.addEventListener("timeout", callBack);
        ajax.addEventListener("load", callBack);
    }

    if (sendItem !== undefined) {
        ajax.send(sendItem);
    } else {
        ajax.send();
    }
}

//see deprecated one
function sendApiPostFetch(url, fd) {
    return sendApiFetch(url, fd, "POST");
}

//see deprecated one
function sendApiGetFetch(url) {
    return sendApiFetch( url, null, 'GET');
}

//see deprecated one
function sendApiDeleteFetch(url) {
    return sendApiFetch( url, null, 'DELETE');
}

//see deprecated one
function sendApiFetch(url, body, method) {
    let auth = window.APP.user.authorization;
    let header = {
        'Authorization': auth
    };

    if (auth === null) delete header.Authorization;
    // if (body !== null) header['Content-Type'] = 'application/x-www-form-urlencoded'
    return fetch(new Request(`/api/v1/${url}`, {
        method: method,
        headers: new Headers(header),
        body: body,
    })).then(r => r.headers.has('Content-Type') && r.headers.get('Content-Type') === 'application/json' ? r.json() : Promise.resolve({code: r.status, message: r.statusText}))
        .then(response => {
            if (response.code === 401 && response.reason === 'Invalid Authorization') {
                window.APP.user.logout(true);
            } else if (response.code >= 200 && response.code < 300) {
                return Promise.resolve(response)
            } else {
                return Promise.reject(response);
            }
    }).then(e => Promise.resolve(e.data||e));
}

//Function that check the response status of the Api
//return the state
function checkApiResStatus(event) {
    if (event.type !== 'load') {
        return API_REP_CONNECTION_ERROR;
    }
    if (event.target.status >= 200 && event.target.status < 300) {
        return API_REP_OK;
    }
    return API_REP_BAD
}

//Function that get some Api data via event
//return an object as response
function getDataAPI(event) {
    return JSON.parse(event.target.responseText)["data"];
}

//Function that get the reason of an Api error via an event as well
//return an object as response
function getAPIErrorReason(event) {
    return JSON.parse(event.target.responseText)["reason"];
}

//Function that create the loading screen
//It can be shown or not
function loadingScreen(show = true) {
    window.APP.loading.switchState(show);
}

//Function that create a very random ID
//return the ID
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

//Function that import fragment of a document into a document
//with template that is a html element
//return document fragment
function importTemplate(template, vars, isString = false) {
    let clone;
    if (isString) {
        clone = document.createElement('div');
        clone.innerHTML = template;
    } else clone = document.importNode(template.content, true);
    const regex = /\$([^$]*)\$/g;
    let matches;
    let couldChangeAttr = clone.querySelectorAll('.ns-template-var-attr');
    for (let element of couldChangeAttr) {
        for (let attr of element.getAttributeNames()) {
            let value = element.getAttribute(attr);
            let new_value = value;
            while (matches = regex.exec(value)) {
                if (vars[matches[1]]) {
                    new_value = new_value.replace(matches[0], vars[matches[1]]);
                }
                element.setAttribute(attr, new_value);
            }
        }
    }
    return clone;
}

//Here, we're creating our User class...
class User {
    permissionLevel;
    app;
    isLog;
    data;
    id = null;
    token = null;

    //getting authorization with token and id here
    get authorization() {
        return (this.token !== null && this.id !== null) ? `${this.id} ${this.token}` : null;
    }

    //TODO avatar
    get profile_picture() {
        return '/res/profile.webp';
    }

    constructor(app) {
        this.app = app;
        this.isLog = false;
        this.permissionLevel = 0;
        let storageToken = localStorage.getItem('token');
        let needResetToken = false;
        try {
            storageToken = JSON.parse(storageToken);
            if (storageToken['id'] !== undefined && storageToken['token'] !== undefined) {
                this.token = storageToken['token'];
                this.id = storageToken['id'];
            } else needResetToken = true;
        } catch (e) {
            needResetToken = true;
        }
        if (needResetToken) localStorage.removeItem('token');
    }

    //Storing token and id locally in client side
    setAuthorization(id, token) {
        this.id = id;
        this.token = token;
        localStorage.setItem('token', JSON.stringify({'id': id, 'token': token}));
    }

    //to log user
    log() {
        if (this.token === null || this.id === null) {
            this.switchBodyLogValue(false);
            this.app.dispatchEvent(new CustomEvent('logout', {
                cancelable: false,
                bubbles: true,
                composed: false,
            }))
        } else {
            sendApiGetFetch('user/me').then(data => {
                this.isLog = true;
                this.data = data;
                this.permissionLevel = parseInt(this.data["permission"]);
                this.switchBodyLogValue(true);
                this.app.dispatchEvent(new CustomEvent('log', {
                    cancelable: false,
                    bubbles: true,
                    composed: false,
                }))
            })
        }
    }

    //Get the status of the user
    get loginLevel() {
        return this.isLog ? LOGIN_LEVEL_CONNECT : LOGIN_LEVEL_DISCONNECT;
    }

    //Redirect on logging out
    logout(redirectLogin) {
        localStorage.removeItem('token');
        this.switchBodyLogValue(false);
        this.isLog = false;
        this.data = [];
        this.id = null;
        this.permissionLevel = 0;
        this.app.dispatchEvent(new CustomEvent('logout', {
            cancelable: false,
            bubbles: true,
            composed: false,
        }))
        if (redirectLogin) {
            this.app.changePage('/auth/')
        }
    }

    switchBodyLogValue(value) {
        document.body.setAttribute('ns-log-status', value);
        if (this.app.currentPages) this.app.currentPages.update_permission_item();
    }
}

//Over here, we are creating our base component class...
class Component {
    app;
    type;

    //get html
    get raw() {
        return '';
    }

    constructor(app, type) {
        this.type = type;
        this.app = app;
    }

    //return html
    getHTML() {
        return this.raw;
    }

    //create parent node
    build(parent) {
        parent.innerHTML = this.getHTML();
    }

    destroy() {

    }

}

//Creating base class pages from component that construct pages
class Pages extends Component {

    app;
    haveHeader;
    haveFooter;
    haveDefaultBackground;

    constructor(app, haveHeader = true, haveFooter = true, haveDefaultBackground = true) {
        super(app, COMPONENT_TYPE_PAGE);
        this.app = app;
        this.haveHeader = haveHeader;
        this.haveFooter = haveFooter;
        this.haveDefaultBackground = haveDefaultBackground;
    }

    get title() {
        return 'NyanScan';
    }

    getHTML(vars) {
        return super.getHTML();
    }

    //construct the pages
    build(parent, vars) {
        const main = _('#ns-main');
        const currentTheme = main.classList.contains('ns-theme-bg');
        if (this.haveDefaultBackground) {
            if (!currentTheme) {
                main.classList.add('ns-theme-bg');
            }
        } else {
            if (currentTheme) {
                main.classList.remove('ns-theme-bg');
            }
        }
        const head = document.querySelector("header");
        const foot = document.querySelector("footer");
        if (this.haveHeader) {
            head.style.display = '';
            if (head.childElementCount === 0) {
                this.app.header.build(head);
            }
        } else {
            head.style.display = 'none';
        }
        if (this.haveFooter) {
            foot.style.display = '';
            if (foot.childElementCount === 0) {
                this.app.footer.build(foot);
            }
        } else {
            foot.style.display = 'none';
        }
        parent.innerHTML = this.getHTML(vars);
        this.update_permission_item();
    }

    update_permission_item() {
        const perm = this.app.user.permissionLevel;
        _('[ns-perm-level]').forEach(e => e.style.display = (e.getAttribute('ns-perm-level') > perm ? 'none' : ''));
    }

    get_client_url() {
        return window.location.pathname;
    }

    send_analytic() {
        sendApiGetFetch(`analytic${this.get_client_url()}`).catch(console.error);
    }

}

class Error404 extends Pages {

    get raw() {
        return `
        <section id="error-404">
            <div class="ns-f-bg ns-f-bg-random">
            
            </div>
            <div class="container vh-100">
                <div class="row vh-100">
                    <div id="error" class="ns-theme-bg ns-theme-text rounded-3 my-5 align-self-center col-10 offset-1 col-md-8 offset-md-2">
                        <div class="ns-center w-100 h-100 flex-row flex-wrap">
                            <div class="w-100 ns-center py-2">
                                <ns-a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo-404"></a>
                            </div>
                            <h1 class="w-auto my-5 me-lg-5 w-25 ps-1 ns-404-h1">404</h1>
                            <p class="w-75 w-lg-50 py-2">Oops, on a cherché aux quatre coins du serveur, mais il semble que cette page n'existe plus ou a été déplacé...</p>
                            <div class="w-100 ns-center py-2">
                                <p>Retourner à la <ns-a href="/" class="btn ns-btn-sm ns-tickle-pink-btn">page d'accueil</ns-a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `
    }

    constructor(app) {
        super(app, false, false, false);
    }
    build(parent, vars) {
        super.build(parent, vars);
        loadRandomBackGround();
    }

}

class InfoModal extends Component {

    m_type;
    title;
    message;
    isHTMLMessage;

    get raw() {
        return `
        <h3>${this.title}</h3>
        <div class="ns-form-group d-flex flex-column gap-2">
            ${this.isHTMLMessage ?  this.message : `<p>${this.message}</p>`}
        </div>
        <div class="mt-3 ns-modal-btn-container">
            <button type="button" class="ns-modal-cancel-btn">Ok</button>
        </div>
        `;
    }

    constructor(app, type, title, message, isHTMLMessage=false) {
        super(app, COMPONENT_TYPE_MODAL);
        this.m_type = type;
        this.title = title;
        this.message = message;
        this.isHTMLMessage = isHTMLMessage;
    }
    build(parent) {
        super.build(parent);
        let btn = parent.querySelector('.ns-modal-cancel-btn');
        switch (this.m_type) {
            case TYPE_ERROR:
                btn.style.backgroundColor = '#dc3545';
                break;
            case TYPE_INFO:
                btn.style.backgroundColor = '#0dcaf0';
                break;
            case TYPE_WARN:
                btn.style.backgroundColor = '#ffc107';
                break;
            case TYPE_SUCCESS:
            default:
                btn.style.backgroundColor = '#198754';
                break;
        }
    }

}

class Toast extends Component {

    m_type;
    title;
    message;
    isHTMLMessage;
    autoClose;
    toast;
    timeoutID = null;

    constructor(app, title, type, message, isHTMLMessage = false, autoClose=600) {
        super(app, COMPONENT_TYPE_TOAST);
        this.m_type = type;
        this.title = title;
        this.message = message;
        this.isHTMLMessage = isHTMLMessage;
        this.autoClose = autoClose;
    }


    build(parent) {
        this.toast = create('div', null, parent, 'ns-toast', "ns-text-black");
        const header = create('div', null, this.toast, 'ns-toast-header');
        const status = create('div', null, header, 'ns-toast-status');
        switch (this.m_type) {
            case TYPE_ERROR:
                status.style.backgroundColor = '#dc3545';
                break;
            case TYPE_INFO:
                status.style.backgroundColor = '#0dcaf0';
                break;
            case TYPE_WARN:
                status.style.backgroundColor = '#ffc107';
                break;
            case TYPE_SUCCESS:
            default:
                status.style.backgroundColor = '#198754';
                break;
        }

        create('strong', null, header).innerText = this.title;
        const close = create('button', null, header, 'btn-close');
        close.addEventListener("click", ((ev) => {
            if (this.timeoutID !== null) clearTimeout(this.timeoutID);
            this.destroy();
        }).bind(this));

        if (this.autoClose >= 0) {
            this.timeoutID = setTimeout((toast) => {
                toast.timeoutID = null;
                toast.destroy();
            }, this.autoClose * 1000, this)
        }

        const footer = create('div', null, this.toast, 'ns-toast-footer');
        if (this.isHTMLMessage)
            footer.innerHTML = this.message;
        else
            footer.innerText = this.message;
    }

    destroy() {
        super.destroy();
        if (this.timeoutID !== null) clearTimeout(this.timeoutID);
        this.toast.remove();
    }
}

class LoadingScreen extends Component {

    screen;
    progressDiv;
    progressBar;
    screenText;

    get raw() {
        return `
            <div class="ns-loading-screen-spinner spinner-border ns-text-red ns-fs-2" role="status"><span class="visually-hidden">Loading...</span></div>
            <div id="ns-loading-screen-progress" class="ns-progress" style="display: none;">
                <div></div>
            </div>
            <p id="ns-loading-screen-text"></p>
        `;
    }

    build(parent) {
        this.screen = create('div', 'ns-loading-screen', parent, 'ns-loading-screen-style');
        this.screen.style.display = 'none';
        this.screen.innerHTML = this.raw;
        this.progressDiv = _('#ns-loading-screen-progress');
        this.screenText = _('#ns-loading-screen-text');
        this.progressBar = this.progressDiv.firstElementChild;
    }

    switchState(enable) {
        this.screen.style.display = enable ? '' : 'none';
        if (enable) {
            this.progress = null;
            this.text = '';
        }
    }

    set progress(value) {
        if (value === null) this.progressDiv.style.display = 'none';
        else  {
            if (this.progressDiv.style.display === 'none')
                this.progressDiv.style.display = '';
            this.progressBar.style.width = value + '%';
        }
    }

    set text(value) {
        this.screenText.innerText = value;
    }

    set textHtml(value) {
        this.screenText.innerHTML = value;
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_FLOAT);
    }
}

//Creating class application from EventTarget
//for our Api (a Homemade one !)
class Application extends EventTarget {
    haveStickyHeader = true;
    header;
    footer;
    index;
    actualURL;
    titleE;
    caches = [];
    user;
    currentPages;
    currentVars = [];
    session = [];
    prefix;
    structure;
    modal;
    loading;

    constructor(header, footer, index, err404, structure, prefix = '') {
        super()
        let host = window.location.hostname;
        if (host.endsWith('localhost')) window.domaine = 'localhost';
        else window.domaine = host.split(/\./g).slice(-2).join('.');
        this.prefix = prefix;
        this.structure = structure;
        this.header = new header(this);
        this.footer = new footer(this);
        this.caches["index"] = index;
        this.caches["404"] = err404;
        window.addEventListener('load', () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
            }
        })
    }

    start() {
        this.session = ["start", new Date()]

        this.titleE = _('title', true);
        this.modal = _('#ns-modal');
        try {
            this.setupModal();
        } catch (err) {
        }

        this.user = new User(this);
        this.user.log();

        this.actualURL = location.pathname.substring(1 + this.prefix.length);
        this.loadURL(this.actualURL);
        this.loading = new LoadingScreen(this);
        this.loading.build(document.body);

        if (window.localStorage.getItem("theme") === "dark") {
            document.body.classList.add("ns-dark");
        }
        window.addEventListener('popstate', this.popState.bind(this));
    }

    popState(e) {
        let href = document.location.pathname;
        if (this.prefix.length > 0) href = href.substring(1 + this.prefix.length);

        const canceled = !this.dispatchEvent(new CustomEvent('popstate', {
            cancelable: true,
            bubbles: true,
            composed: false,
            detail: {
                href: href
            }
        }));
        if (!canceled) {
            this.loadURL(href);
        }
    }

    setupModal() {
        this.modal.display = "none";
        this.modal.addEventListener("click", ev => {
            if (ev.target.classList.contains("ns-modal-container")) {
                ev.target.style.display = "none";
            }
        }, {capture: true});
        _('#ns-modal-main-close').addEventListener("click", (function (ev) {
            ev.preventDefault();
            this.modal.style.display = "none";
        }).bind(this))
    }

    openModal(modal) {
        if (modal.type !== COMPONENT_TYPE_MODAL) {
            return;
        }
        const container = _('#ns-modal-container');
        container.innerHTML = '';
        modal.build(container);
        for (let btn of container.querySelectorAll('.ns-modal-cancel-btn')) {
            btn.addEventListener("click", (function (ev) {
                ev.preventDefault();
                this.modal.style.display = "none";
            }).bind(this))
        }
        this.modal.style.display = 'flex';
    }

    openInfoModal(type, title, message, isHtmlMessage=false) {
        this.openModal(new InfoModal(this, type, title, message, isHtmlMessage));
    }

    createToast(type, title, message, isHtmlMessage=false, autoClose=600) {
        let toast = new Toast(this, title, type, message, isHtmlMessage, autoClose);
        toast.build(_('#ns-toast-container'));
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    async load_module(name) {
        if (this.caches[name] === undefined) {
            const module = await import(`/pages/${name}.js?version=${VERSION}`);
            this.caches[name] = module.default;
        }
        return this.caches[name];
    }

    changePage(url) {
        if (url === undefined || url === null) {
            url = '';
        }
        this.actualURL = url;
        if (url.startsWith('/')) {
            url = url.substring(1);
        }
        window.history.pushState("", "", (this.prefix ? `/${this.prefix}/` : '/') + url);
        this.loadURL(this.actualURL);
    }

    loadURL(url) {
        if (url.startsWith('/')) {
            url = url.substring(1);
        }
        // remove file extension from URL
        url.replace(/^(.*)(\.html|\.js|\.php)(\?.*)?$/, '$1$3');
        let current_url = url;
        let current = this.structure;

        let finalP = undefined;
        let finalV = {};
        let finalLoginLevel = 0;

        big_loop: while (current !== null) {
            for (let obj of current) {
                let matches = current_url.match(obj.re);
                if (matches) {
                    if (obj.var) {
                        obj.var.forEach(value => {
                            finalV[value.name] = matches[value.id];
                        })
                    }
                    if (obj.rel) {
                        finalP = obj.rel;
                        if (obj.loginLevel !== undefined) {
                            finalLoginLevel = obj.loginLevel;
                        }
                        break big_loop;
                    } else if (obj.child) {
                        if (obj.child.path_var) {
                            current_url = matches[obj.child.path_var];
                            if (current_url === undefined) {
                                current_url = "";
                            }
                            if (current_url.startsWith('/')) {
                                current_url = current_url.substring(1);
                            }
                        }
                        current = obj.child.elements;
                        continue big_loop;
                    }
                }
            }
            current = null;
        }
        if (finalP === undefined) {
            this.do404();
            return;
        }
        if (finalLoginLevel) {
            const currentLevel = this.user.loginLevel;
            if (finalLoginLevel !== currentLevel) {
                finalP = 'index';
                window.history.pushState("", "", this.prefix ? `/${this.prefix}/` : '/');
            }
        }
        this.load_module(finalP).then(page => this.loadPage(new page(this), finalV));
    }

    do404() {
        this.load_module('404').then(page => this.loadPage(new page(this), []));
    }

    loadPage(page, vars) {
        if (this.currentPages) {
            this.currentPages.destroy();
        }
        const content = document.querySelector("#ns-main");
        this.currentVars = vars;
        page.build(content, vars);
        this.setTitle(page.title);
        this.dispatchEvent(new CustomEvent('pageLoad', {
            cancelable: false,
            bubbles: true,
            composed: false,
        }))
        this.setHeaderSticky(page.haveStickyHeader === undefined ? true : page.haveStickyHeader);
        this.currentPages = page;
        page.send_analytic();
    }

    reload() {
        if (!this.currentPages) return;
        const C = this.currentPages.constructor;
        console.log(this.currentPages);
        console.log(C);
        if (C) {
            this.loadPage(new C(this), this.currentVars);
        }
    }

    setHeaderSticky(value) {
        const header = _('header', true);
        const haveStick = header.classList.contains('sticky-top');
        if (value ^ haveStick) {
            if (value) {
                header.classList.add('sticky-top');
            } else {
                header.classList.remove('sticky-top');
            }
        }
    }

    setTitle(title) {
        this.titleE.innerText = title;
    }

    fatalError() {

    }
}

//Creating the captcha
class Captcha extends Component {

    block;
    uuid;

    get raw() {
        return `
        <ns-api-data-block id="ns-captcha-data-block" href="captchaSettings">
            <div id="captcha">
                <input id="captcha-id" type="hidden" name="captcha-id"">
                <input class="captcha-input" type="hidden" name="captcha">
                <div class="captcha-view">
                    <img id="captcha-img" alt="captcha" src="">
                </div>
                <div class="captcha-piece-storage">
                
                </div>
                <div id="captcha-load" style="display: none">
                    <div class="spinner-border ns-text-red" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                </div>
                <div id="captcha-error" style="display: none">
                      <strong class="ns-text-red">Une erreur est survenue.</strong>
                      <p>Merci <button class="btn btn-secondary btn-sm" onClick="window.location.reload();">d'actualiser</button> la page pour ressayer. Si le problème persiste, merci de contacter un administrateur.</p>
                </div>
            </div>
        </ns-api-data-block>
        `
    }

    build(parent) {
        super.build(parent);
        this.block = _('#ns-captcha-data-block');
        if (this.block.dataLoad) {
            this.setupSettings();
        }
        this.block.addEventListener('dataLoad', this.setupSettings.bind(this));
    }

    setupSettings() {
        const captcha = _('#captcha');
        captcha.style.setProperty("--ns-captcha-width", this.block.getField('width') + 'px');
        captcha.style.setProperty("--ns-captcha-height", this.block.getField('height') + 'px');
        captcha.style.setProperty("--ns-captcha-piece-size", this.block.getField('piece_size') + 'px');
        captcha.style.setProperty("--ns-captcha-ceil-size", this.block.getField('cell_size') + 'px');
        captcha.style.setProperty("--ns-captcha-piece-count", this.block.getField('number_piece'));
        this.setUUID();

        const cap = document.getElementById('captcha');
        const main_image = document.getElementById('captcha-img');

        const load = document.getElementById("captcha-load");

        if (main_image.complete) {
            if (main_image.naturalWidth === 0) {
                document.getElementById("captcha-error").style.display = 'flex';
            } else {
                this.setup_captcha(cap, main_image);
            }
        } else {
            load.style.display = 'flex';
            main_image.addEventListener('load', ev => {
                load.style.display = 'none';
                this.setup_captcha(cap, main_image);
            });
            main_image.addEventListener('error', function () {
                load.style.display = 'none';
                document.getElementById("captcha-error").style.display = 'flex';
            })
        }
    }

    setUUID() {
        const uuid = uuidv4();
        this.uuid = uuid;
        _('#captcha-id').value = uuid;
        _('#captcha-img').src = '/captchaGet.php?id=' + uuid;
        const storage = _('.captcha-piece-storage', true);
        for (let i = 0; i < this.block.getField('number_piece') * 1; i++) {
            let cont = create('div', null, storage, 'captcha-piece');
            let img = create('img', null, cont);
            img.src = '/captchaGet.php?id=' + uuid;
            img.alt = 'captcha_piece';
        }
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_FLOAT);
    }

    setup_captcha(captcha) {
        // GET var
        const numberPiece = this.block.getField('number_piece') * 1;
        const pieceSize = this.block.getField('piece_size') * 1;
        const ceilSize = this.block.getField('cell_size') * 1;
        const captchaHeight = this.block.getField('height') * 1;
        const captchaWidth = this.block.getField('width') * 1;

        let currentPiece;

        for (let i = 0; i < numberPiece; i++) {
            currentPiece = captcha.getElementsByClassName("captcha-piece")[i];
            currentPiece.style.top = `${captchaHeight + ceilSize}px`;
            currentPiece.style.left = (ceilSize + (pieceSize + ceilSize) * i) + 'px';
            currentPiece.pieceCont = i;

            currentPiece.firstElementChild.style.marginTop = '-10px';
            currentPiece.firstElementChild.style.marginLeft = '-' + ((captchaWidth + (ceilSize * 2 + pieceSize) * i) + ceilSize) + 'px';
            // remove image drag
            currentPiece.firstElementChild.ondragstart = () => {
                return false;
            };
        }

        const input = captcha.getElementsByClassName("captcha-input")[0];

        function move(e) {
            if (!e.target.parentElement || !e.target.parentElement.classList.contains('captcha-piece')) {
                return;
            }
            const target = e.target.parentElement;
            target.moving = true;
            if (e.clientX) {
                target.oldX = e.clientX; // If they exist, use Mouse input
                target.oldY = e.clientY;
            } else {
                target.oldX = e.touches[0].clientX; // Otherwise, use touch input
                target.oldY = e.touches[0].clientY;
            }

            target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
            target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;

            function endDrag() {
                target.moving = false;
            }

            function dr(ev) {
                ev.preventDefault();
                if (!target.moving) {
                    return;
                }
                if (ev.clientX) {
                    target.distX = ev.clientX - target.oldX;
                    target.distY = ev.clientY - target.oldY;
                } else {
                    target.distX = ev.touches[0].clientX - target.oldX;
                    target.distY = ev.touches[0].clientY - target.oldY;
                }
                let x = Captcha.validateCord(target.oldLeft + target.distX, captchaWidth, captchaHeight, ceilSize, pieceSize);
                let y = Captcha.validateCord(target.oldTop + target.distY, captchaWidth, captchaHeight, ceilSize, pieceSize, false);
                target.style.left = x + "px";
                target.style.top = y + "px";

                input.value = Captcha.newStringCord(input.value, target.pieceCont, x, y);
            }

            document.onmouseup = endDrag;
            document.ontouchend = endDrag;
            document.onmousemove = dr;
            document.ontouchmove = dr;
        }

        document.onmousedown = move;
        document.ontouchstart = move;
    }

    static validateCord(pos, captchaWidth, captchaHeight, ceilSize, pieceSize, isx = true) {
        return Math.min(isx ? (captchaWidth - ceilSize) : (captchaHeight + ceilSize + pieceSize), Math.max(0, Math.floor(pos / ceilSize) * ceilSize));
    }

    static newStringCord(old = "", index = 0, x = 0, y = 0) {
        if (!old) {
            old = '0';
        }
        let split = old.split(':');
        while (split.length < index * 2 + 1) {
            split.push('0');
        }
        split[index * 2] = `${x}`;
        split[index * 2 + 1] = `${y}`;
        return split.join(':');
    }
}

//This function get the path of an image with its ID
//String.prototype.substr() is deprecated and is not in web standard anymore
//replaced with String.prototype.substring()
function image_id_to_path(id) {
    const format = id.substring(0, 1);
    const ext = '.' + ({'w': 'webp', 'p': 'png', 'j': 'jpg', 'g': 'gif', 'n': ''}[format]);
    return `${window.location.protocol}//res.${window.domaine}/picture/${id.substring(0, 5)}/${id.substring(5)}${ext}`
}

//Return a html span with message from the status of a project
function project_status_to_html($status) {
    switch ($status) {
        case '0':
            return '<span class="project-status-wait">En attente de vérification</span>';
        case '1':
            return '<span class="project-status-denied">Rejeté</span>';
        case '2':
            return '<span class="project-status-accept">Accepté, en attente de contenu</span>';
        case '3':
            return '<span class="project-status-publish">Publié</span>';
        default:
            return '';
    }
}

//same as above but for event
function event_status_to_html($status) {
    switch ($status) {
        case '0':
            return '<span class="event-status-wait">En attente de vérification</span>';
        case '1':
            return '<span class="event-status-denied">Rejeté</span>';
        case '2':
            return '<span class="event-status-accept">Accepté, en attente de contenu</span>';
        case '3':
            return '<span class="event-status-publish">Publié</span>';
        default:
            return '';
    }
}

function escapeHtml(text) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

function formatMessage(message) {
    return escapeHtml(message).replace(/\n/g, "<br>");
}

function pickHex(color1, color2, weight) {
    let w1 = weight;
    let w2 = 1. - w1;
    return [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
}

function hexColorToCSSColor(color) {
    return `rgb(${color[0]},${color[1]},${color[2]})`
}

function arrayPop(array, key) {
    const e = array[key];
    if (e !== undefined) {
        delete (array[key]);
    }
    return e;
}

function isInt(value) {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}

function registerToggle(toggle) {
    if (toggle) {
        toggle.checked = window.localStorage.getItem("theme") === "dark";
        toggle.addEventListener("change", () => {
            if (toggle.checked) {
                if (!document.body.classList.contains("ns-dark")) {
                    document.body.classList.add("ns-dark")
                }
                window.localStorage.setItem("theme", "dark");
            } else {
                if (document.body.classList.contains("ns-dark")) {
                    document.body.classList.remove("ns-dark")
                }
                window.localStorage.setItem("theme", "light");
            }
        })
    }
}

//Create the Carousel
function setupCarousel(carousel) {
    const imagesDiv =  carousel.getElementsByClassName("ns-carousel-images")[0];
    const images = imagesDiv.getElementsByTagName("img");
    const image_count = images.length;
    carousel.nsCarouselCount = image_count;
    const points = carousel.getElementsByClassName("ns-carousel-points");
    for (let point of points) {
        for (let i = 0; i < image_count; i++) {
            const point_div = document.createElement("div");
            point_div.classList.add("ns-carousel-point");
            point_div.topCarousel = carousel;
            point_div.nsCarouselIndex = i;
            point_div.addEventListener("click", (evt) => {
                setCarouselActiveElements(evt.currentTarget.topCarousel, evt.currentTarget.nsCarouselIndex)
            }, false);
            point.appendChild(point_div);
        }
    }
    for (let i = 0; i < image_count; i++) {
        images[i].topCarousel = carousel;
        images[i].nsCarouselIndex = i;
        images[i].addEventListener("click", (evt) => {
            setCarouselActiveElements(evt.currentTarget.topCarousel, evt.currentTarget.nsCarouselIndex, true);
        }, false);
    }
    setCarouselActiveElements(carousel, 0);
}

//Make it functional and in loop
function setCarouselActiveElements(carousel, index, checkUrl = false) {
    if (carousel.nsCarouselCount <= index) return;

    const imagesDiv =  carousel.getElementsByClassName("ns-carousel-images")[0];
    const images = imagesDiv.getElementsByTagName("img");
    const current = images[index];
    if (current.c_href !== undefined && current.classList.contains("ns-carousel-2")) {
        window.APP.loadURL(current.c_href);
        return;
    }
    for (let image of images) {
        image.classList.remove("ns-carousel-1");
        image.classList.remove("ns-carousel-2");
        image.classList.remove("ns-carousel-3");
        image.classList.remove("ns-carousel-off");
        image.classList.add("ns-carousel-off");
    }
    images[index].classList.add("ns-carousel-2");
    images[index].classList.remove("ns-carousel-off");
    images[(index === 0 ? images.length : index) - 1].classList.add("ns-carousel-1");
    images[(index === 0 ? images.length : index) - 1].classList.remove("ns-carousel-off");
    images[(index + 1 < carousel.nsCarouselCount) ? (index + 1) : 0].classList.add("ns-carousel-3");
    images[(index + 1 < carousel.nsCarouselCount) ? (index + 1) : 0].classList.remove("ns-carousel-off");

    const points = carousel.getElementsByClassName("ns-carousel-points");
    for (let point of points) {
        const points = point.children;
        for (let i = 0; i < points.length; i++) {
            points[i].classList.remove("ns-carousel-point-active");
            if (i === index) points[i].classList.add("ns-carousel-point-active");
        }
    }
}

function loadRandomBackGround() {
    _('.ns-f-bg-random').forEach(e => {
        if (e.style.backgroundImage.length === 0) {
            const url = `/res/background_${Math.floor(Math.random() * (9 - 1) + 1)}.jpg`;
            console.log(url)
            e.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${url}")`;
        }
    })
}
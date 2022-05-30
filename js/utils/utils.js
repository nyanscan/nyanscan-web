const COMPONENT_TYPE_HEADER = 0;
const COMPONENT_TYPE_FOOTER = 1;
const COMPONENT_TYPE_PAGE = 2;
const COMPONENT_TYPE_FLOAT = 3;
const COMPONENT_TYPE_MODAL = 4;

const API_REP_OK = 1;
const API_REP_BAD = 0;
const API_REP_CONNECTION_ERROR = -1;

const LOGIN_LEVEL_DISCONNECT = -1;
const LOGIN_LEVEL_CONNECT = 1;


function _(query, mono=false) {
    if (query.startsWith('#') && !query.includes(' ')) mono = true;
    if (mono) return document.querySelector(query);
    return document.querySelectorAll(query);
}

function create(type, id = null, parent = null, ...cla) {
    const e = document.createElement(type);
    if (cla.length > 0) e.classList.add(...cla);
    if (id) e.id = id;
    if (parent) parent.appendChild(e);
    return e;
}

function createPromise(type, id = null, parent = null, ...cla) {
    return new Promise(resolve => {
        const e = document.createElement(type);
        if (cla) e.classList.add(...cla);
        if (id) e.id = id;
        if (parent) parent.appendChild(e);
        resolve(e);
    });
}

function sendApiPostRequest(url, formData, callBack = null, progressCallBack=null) {
    sendApiRequest("POST", url, callBack, progressCallBack, formData);
}

function sendApiGetRequest(url,  callBack = null, progressCallBack=null) {
    sendApiRequest("GET", url, callBack, progressCallBack);
}

function sendApiDeleteRequest(url,  callBack = null, progressCallBack=null) {
    sendApiRequest("DELETE", url, callBack, progressCallBack);
}

function sendApiRequest(method, url, callBack, progressCallBack=undefined, sendItem=undefined) {
    const ajax = new XMLHttpRequest()
    ajax.open(method, '/api/v1/' + url, true);

    if (progressCallBack !== undefined && progressCallBack !== null) {
        ajax.addEventListener('progress', progressCallBack);
    }

    if (callBack !== null && callBack !== undefined) {
        ajax.addEventListener("error", callBack);
        ajax.addEventListener("abort", callBack);
        ajax.addEventListener("timeout", callBack);
        ajax.addEventListener("load", callBack);
    }

    if (sendItem !== undefined)
        ajax.send(sendItem);
    else ajax.send();
}

function checkApiResStatus(event) {
    if (event.type !== 'load') return API_REP_CONNECTION_ERROR;
    if (event.target.status >= 200 && event.target.status < 300) return API_REP_OK;
    return API_REP_BAD
}

function getDataAPI(event) {
    return JSON.parse(event.target.responseText)["data"];
}

function getAPIErrorReason(event) {
    return JSON.parse(event.target.responseText)["reason"];
}

function loadingScreen(show = true) {
   window.APP.loading.switchState(show);
}


function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function importTemplate(template, vars) {
    let clone = document.importNode(template.content, true);
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

class User {
    app;
    isLog;
    data;

    get profile_picture() {
        return '/res/profile.webp';
    }

    constructor(app) {
        this.app = app;
        this.isLog = false;
    }

    log() {
        sendApiGetRequest('user/me', (function (ev) {
            if (checkApiResStatus(ev) === API_REP_OK) {
                this.isLog = true;
                this.data = getDataAPI(ev);
                this.switchBodyLogValue(true);
                this.app.dispatchEvent(new CustomEvent('log', {
                    cancelable: false,
                    bubbles: true,
                    composed: false,
                }))
            } else {
                this.switchBodyLogValue(false);
                this.app.dispatchEvent(new CustomEvent('logout', {
                    cancelable: false,
                    bubbles: true,
                    composed: false,
                }))
            }
        }).bind(this))
    }

    get loginLevel() {
        return this.isLog ? LOGIN_LEVEL_CONNECT : LOGIN_LEVEL_DISCONNECT;
    }

    logout(redirectLogin) {
        this.switchBodyLogValue(false);
        sendApiGetRequest('auth/logout', (function (ev) {
            if (checkApiResStatus(ev) === API_REP_OK) {
                this.isLog = false;
                this.data = [];
                this.app.dispatchEvent(new CustomEvent('logout', {
                    cancelable: false,
                    bubbles: true,
                    composed: false,
                }))
                if (redirectLogin) this.app.changePage('/auth/')

            }
        }).bind(this))
    }

    switchBodyLogValue(value) {
        document.body.setAttribute('ns-log-status', value);
    }

}
class Component {
    app;
    type;

    get raw() {
        return '';
    }

    constructor(app, type) {
        this.type = type;
        this.app = app;
    }

    getHTML() {
        return this.raw;
    }

    build(parent) {
        parent.innerHTML = this.getHTML();
    }

    destroy() {

    }

}
class Pages extends Component {

    app;
    haveHeader;
    haveFooter;
    haveDefaultBackground;


    constructor(app, haveHeader = true, haveFooter = true, haveDefaultBackground =true) {
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

    build(parent, vars) {
        const main = _('#ns-main');
        const currentTheme = main.classList.contains('ns-theme-bg');
        if (this.haveDefaultBackground) {
            if (!currentTheme) main.classList.add('ns-theme-bg');
        } else {
            if (currentTheme) main.classList.remove('ns-theme-bg');
        }
        const head = document.querySelector("header");
        const foot = document.querySelector("footer");
        if (this.haveHeader) {
            head.style.display = '';
            if (head.childElementCount === 0) this.app.header.build(head);
        } else head.style.display = 'none';
        if (this.haveFooter) {
            foot.style.display = '';
            if (foot.childElementCount === 0) this.app.footer.build(foot);
        } else foot.style.display = 'none';
        parent.innerHTML = this.getHTML(vars);
    }

    get_client_url() {
        return window.location.pathname;
    }

    send_analytic() {
        sendApiGetRequest(`analytic${this.get_client_url()}`);
    }

}
class Error404 extends Pages {

    get raw() {
        return `
        <section id="error-404">
    <div class="ns-f-bg ns-f-bg-err"></div>
    <div class="container vh-100">
        <div class="row vh-100">
            <div id="error" class="ns-theme-bg ns-theme-text rounded-3 my-5 align-self-center col-10 offset-1 col-md-8 offset-md-2">
                <div class="ns-center w-100 h-100 flex-row flex-wrap">
                    <div class="w-100 ns-center py-2"><ns-a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo-404"></a></div>
                    <h1 class="w-auto my-5 me-lg-5 w-25 ps-1 ns-404-h1">404</h1>
                    <p class="w-75 w-lg-50 py-2">Oops, on a cherché aux quatre coins du serveur, mais il semble que cette page n'existe plus ou a été déplacé...</p>
                    <div class="w-100 ns-center py-2"><p>Retourner à la <ns-aa href="/">page d'accueil</ns-aa></p></div>
                </div>
            </div>
        </div>
    </div>
</section>`
    }

    constructor(app) {
        super(app, false, false, false);
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

        this.screen = create('div', 'ns-loading-screen', parent,  'ns-loading-screen-style');
        this.screen.style.display = 'none';
        this.screen.innerHTML = this.raw;
        this.progressDiv = _('#ns-loading-screen-progress');
        this.screenText = _('#ns-loading-screen-text');
        this.progressBar = this.progressDiv.firstElementChild;
    }

    switchState(enable) {
        this.screen.style.display = enable ? '' : 'none';
    }

    set progress(value) {
        if (this.progressDiv.style.display === 'none')
            this.progressDiv.style.display = '';
        this.progressBar.style.width = value + '%';
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

class Application extends EventTarget {

    haveSticky = true;
    header;
    footer;
    index;
    actualURL;
    titleE;
    caches = [];
    user;
    currentPages;
    session = [];
    prefix;
    structure;
    modal;
    loading;

    constructor(header, footer, index, err404, structure, prefix='') {
        super()
        this.prefix = prefix;
        this.structure = structure;
        this.header = new header(this);
        this.footer = new footer(this);
        this.caches["index"] = index;
        this.caches["404"] = err404;
        this.session = ["start", new Date()]

        this.titleE = _('title', true);
        this.modal = _('#ns-modal');
        try {
            this.setupModal();
        } catch (err) {}

        this.user = new User(this);
        this.user.log();

        this.actualURL = location.pathname.substring(1 + this.prefix.length);
        this.loadURL(this.actualURL);
        this.loading = new LoadingScreen(this);
        this.loading.build(document.body);
    }

    setupModal() {
        this.modal.display = "none";
        this.modal.addEventListener("click", ev => {
            if (ev.target.classList.contains("ns-modal-container")) ev.target.style.display = "none";
        }, {capture: true});
        _('#ns-modal-main-close').addEventListener("click", (function (ev) {
            ev.preventDefault();
            this.modal.style.display = "none";
        }).bind(this))
    }

    openModal(modal) {
        if (modal.type !== COMPONENT_TYPE_MODAL) return;
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

    closeModal() {
        this.modal.style.display = 'none';
    }

    async load_module(name) {
        if (this.caches[name] === undefined) {
            const module = await import(`/pages/${name}.js`);
            this.caches[name] = module.default;
        }
        return this.caches[name];
    }

    changePage(url) {
        if (url === undefined || url === null) url = '';
        this.actualURL = url;
        if (url.startsWith('/')) url = url.substring(1);
        window.history.pushState("", "", (this.prefix ? `/${this.prefix}/` : '/') + url);
        this.loadURL(this.actualURL);
    }

    loadURL(url) {
        if (url.startsWith('/')) url = url.substring(1);
        // remove .html .js and .php
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
                        if (obj.loginLevel !== undefined) finalLoginLevel = obj.loginLevel;
                        break big_loop;
                    } else if (obj.child) {
                        if (obj.child.path_var) {
                            current_url = matches[obj.child.path_var];
                            if (current_url === undefined) current_url = "";
                            if (current_url.startsWith('/')) current_url = current_url.substring(1);
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
        if (this.currentPages) this.currentPages.destroy();
        const content = document.querySelector("#ns-main");
        page.build(content, vars);
        this.setTitle(page.title);
        this.setHeaderSticky(page.haveStickyHeader === undefined ? true : page.haveStickyHeader );
        this.currentPages = page;
        page.send_analytic();
    }

    setHeaderSticky(value) {
        const header = _('header', true);
        const haveStick = header.classList.contains('sticky-top');
        if (value ^ haveStick) {
            if (value) header.classList.add('sticky-top');
            else header.classList.remove('sticky-top');
        }

    }

    setTitle(title) {
        this.titleE.innerText = title;
    }

    fatalError() {

    }

}
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
        <img id="captcha-img" alt="captcha">
    </div>
    <div class="captcha-piece-storage">
    </div>
    <div id="captcha-load" style="display: none">
        <div class="spinner-border ns-text-red" role="status">
            <span class="visually-hidden">Loading...</span>
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
        if (this.block.dataLoad) this.setupSettings();
        this.block.addEventListener('dataLoad', this.setupSettings.bind(this));
    }

    setupSettings() {
        const captcha = _('#captcha');
        captcha.style.setProperty("--ns-captcha-width", this.block.getField('width')+'px');
        captcha.style.setProperty("--ns-captcha-height", this.block.getField('height')+'px');
        captcha.style.setProperty("--ns-captcha-piece-size", this.block.getField('piece_size')+'px');
        captcha.style.setProperty("--ns-captcha-ceil-size", this.block.getField('cell_size')+'px');
        captcha.style.setProperty("--ns-captcha-piece-count", this.block.getField('number_piece'));
        this.setUUID();

        const cap = document.getElementById('captcha');
        const main_image = document.getElementById('captcha-img');

        const load = document.getElementById("captcha-load");

        if (main_image.complete) {
            if (main_image.naturalWidth === 0) {
                document.getElementById("captcha-error").style.display = 'flex';
            }
            else this.setup_captcha(cap, main_image);
        }
        else {
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
            img.src =  '/captchaGet.php?id=' + uuid;
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
                target.oldX = e.clientX; // If they exist then use Mouse input
                target.oldY = e.clientY;
            } else {
                target.oldX = e.touches[0].clientX; // Otherwise use touch input
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
                let y = Captcha.validateCord(target.oldTop + target.distY, captchaWidth, captchaHeight, ceilSize, pieceSize,false);
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
    static newStringCord(old="", index=0, x=0, y=0) {
        if (!old) old = '0';
        let split = old.split(':');
        while (split.length < index * 2 + 1) {
            split.push('0');
        }
        split[index * 2] = `${x}`;
        split[index * 2 + 1] = `${y}`;
        return split.join(':');
    }
}

// const TOAST_SUCCESS = 0;
// const TOAST_INFO = 1;
// const TOAST_WARN = 2;
// const TOAST_ERROR = 3;
//
//
// // todo : redo
// function loadToastSession() {
//     const session = sessionStorage.getItem('ns-toast');
//     if (session) {
//         const toasts = JSON.parse(session);
//         for (let key of Object.keys(toasts)) {
//             createToastOPT(toasts[key], key);
//         }
//     }
// }
//
// function createToastOPT(opt, uuid=null) {
//     createToast(opt.title, opt.type, opt.message, opt.html || false, uuid);
// }
//
// function createToast(title, type, message, html = false, uuid=null) {
//     if (!uuid) {
//         uuid = uuidv4();
//         const opt = {
//             "title": title,
//             "type": type,
//             "message": message
//         }
//         if (html) opt["html"] = true;
//
//         const session = JSON.parse(sessionStorage.getItem('ns-toast') || "{}");
//         session[uuid] = opt;
//         sessionStorage.setItem('ns-toast', JSON.stringify(session));
//     }
//
//     let container = _('#ns-toast-container');
//     if (!container) {
//         container = create('div', 'ns-toast-container', document.body, 'ns-toast-container-style')
//     }
//
//     const toast = create('div', null, container, 'ns-toast', "ns-text-black");
//     const header = create('div', null, toast, 'ns-toast-header');
//     const status = create('div', null, header, 'ns-toast-status');
//     switch (type) {
//         case TOAST_ERROR:
//             status.style.backgroundColor = '#dc3545';
//             break;
//         case TOAST_INFO:
//             status.style.backgroundColor = '#0dcaf0';
//             break;
//         case TOAST_WARN:
//             status.style.backgroundColor = '#ffc107';
//             break;
//         case TOAST_SUCCESS:
//         default:
//             status.style.backgroundColor = '#198754';
//             break;
//     }
//     create('strong', null, header).innerText = title;
//     const close = create('button', null, header, 'btn-close');
//     close.ariaLabel = 'closeLabel';
//     close.id = uuid;
//     close.addEventListener("click", (ev) => {
//         ev.target.closest('.ns-toast').remove();
//         const session = JSON.parse(sessionStorage.getItem('ns-toast') || "{}");
//         if (session) {
//             delete session[ev.target.id];
//             sessionStorage.setItem('ns-toast', JSON.stringify(session));
//         }
//     });
//     const footer = create('div', null, toast, 'ns-toast-footer');
//     if (html)
//         footer.innerHTML = message;
//     else
//         footer.innerText = message;
// }

function image_id_to_patch(id) {
    const format = id.substr(0, 1);
    const ext = '.' + ({'w': 'webp', 'p': 'png', 'j': 'jpg', 'g': 'gif', 'n': ''}[format]);
    return `/picture/${id.substr(0, 5)}/${id.substr(5)}${ext}`
}

function project_status_to_html($status) {
    switch ($status) {
        case '0': return '<span class="project-status-wait">Attente de vérification</span>'; break;
        case '1': return '<span class="project-status-denied">Rejeté</span>'; break;
        case '2': return '<span class="project-status-accept">Accepté en attente de contenu</span>'; break;
        case '3': return '<span class="project-status-publish">Publié</span>'; break;
        default: return '';
    }
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
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
    if (e !== undefined) delete (array[key]);
    return e;
}
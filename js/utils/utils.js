const COMPONENT_TYPE_HEADER = 0;
const COMPONENT_TYPE_FOOTER = 1;
const COMPONENT_TYPE_PAGE = 2;
const COMPONENT_TYPE_FLOAT = 3;

const API_REP_OK = 1;
const API_REP_BAD = 0;
const API_REP_CONNECTION_ERROR = -1;

const LOGIN_LEVEL_DISCONNECT = -1;
const LOGIN_LEVEL_CONNECT = 1;


function _(query, mono=false) {
    if (query.startsWith('#')) mono = true;
    if (mono) return document.querySelector(query);
    return document.querySelectorAll(query);
}

function create(type, id = null, parent = null, ...cla) {
    const e = document.createElement(type);
    if (cla) e.classList.add(...cla);
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

function sendApiPostRequest(url, formData, callBack = null) {

    const ajax = new XMLHttpRequest()
    ajax.open("POST", '/api/v1/' + url, true);

    if (callBack !== null) {
        ajax.addEventListener("error", callBack);
        ajax.addEventListener("abort", callBack);
        ajax.addEventListener("timeout", callBack);
        ajax.addEventListener("load", callBack);
    }

    ajax.send(formData);
}

function sendApiGetRequest(url,  callBack = null) {
    const ajax = new XMLHttpRequest()
    ajax.open("GET", '/api/v1/' + url, true);

    if (callBack !== null) {
        ajax.addEventListener("error", callBack);
        ajax.addEventListener("abort", callBack);
        ajax.addEventListener("timeout", callBack);
        ajax.addEventListener("load", callBack);
    }

    ajax.send();
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
    let screen = _('#ns-loading-screen');
    if (!screen) {
        screen = create('div', 'ns-loading-screen', document.body, 'ns-loading-screen-style');
        screen.innerHTML = '<div class="spinner-border ns-text-red ns-fs-2" role="status">' +
            '<span class="visually-hidden">Loading...</span></div>';
    }

    screen.style.display = show ? '' : 'none';
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
        if (this.haveHeader) {
            this.app.header.build(document.querySelector("header"));
        } else document.querySelector("header").innerHTML = '';
        if (this.haveFooter) {
            this.app.footer.build(document.querySelector("footer"));
        } else document.querySelector("footer").innerHTML = '';
        parent.innerHTML = this.getHTML(vars);
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
        console.log(this.block.rawData);
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

        console.log(numberPiece, pieceSize, ceilSize, captchaHeight, captchaWidth);

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
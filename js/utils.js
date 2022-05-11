const TOAST_SUCCESS = 0;
const TOAST_INFO = 1;
const TOAST_WARN = 2;
const TOAST_ERROR = 3;

function _(query) {
    if (!query) return null;
    if (query[0] === ".")
        return document.getElementsByClassName(query.substring(1));
    else if (query[0] === "#")
        return document.getElementById(query.substring(1));
    else return document.getElementsByTagName(query);
}
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
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

function loadingScreen(show = true) {
    let screen = _('#ns-loading-screen');
    if (!screen) {
        screen = create('div', 'ns-loading-screen', document.body, 'ns-loading-screen-style');
        screen.innerHTML = '<div class="spinner-border ns-text-red ns-fs-2" role="status">' +
            '<span class="visually-hidden">Loading...</span></div>';
    }

    screen.style.display = show ? '' : 'none';
}

const default_option = {
    on_send: {
        disable_btn: true,
        loading_screen: true
    },
    on_load: {
        on_error: {
            // type: "toast",
            // title: 'Error',
            // message: 'Contacter un admin'
            type: "function",
            value: (ev) => {
                console.log(ev);
            }
        },
        on_success: {
            type: "toast",
            title: 'Success',
            redirect: '/forum'
        }
    }
}

function setupAPIForm(btnID, uri, options = {}) {
    const btn = _('#' + btnID);
    if (btn && btn.form) {

        btn.addEventListener('click', ev => {
            const on_click_option = options.on_send || default_option.on_send;
            const on_load_option = options.on_load || default_option.on_load;
            if (on_click_option.loading_screen)
                loadingScreen(true);
            if (on_click_option.disable_btn)
                btn.disabled = true;

            const form = btn.form;

            const fd = new FormData(form);
            sendApiPostRequest(uri, fd, (evt) => {
                if (on_click_option.loading_screen)
                    loadingScreen(false);
                btn.disabled = false;

                if (evt.type === 'load' && evt.target.status >= 200 && evt.target.status < 300) {
                    const settings = on_load_option.on_success || default_option.on_load.on_success;
                    const rep = JSON.parse(evt.target.responseText);
                    switch (settings.type) {
                        case 'div':
                            const divOut = _('#' + settings.id);
                            divOut.innerText = settings.message || rep.answer;
                            divOut.style.display = 'block';
                            break;
                        case 'toast':
                            createToast(settings.title || "Success", TOAST_SUCCESS, settings.message || rep["answer"] || "error");
                            if (settings.redirect) document.location.href = settings.redirect;
                            break
                    }
                } else {
                    const settings = on_load_option.on_error || default_option.on_load.on_error;
                    const reason = (evt.type === "load" ? JSON.parse(evt.target.responseText)["reason"] : settings.message || "Erreur..")
                    switch (settings.type) {
                        case 'function':
                            settings.value(evt);
                            break;
                        case 'div':
                            const divOut = _('#' + settings.id);
                            const rep = JSON.parse(evt.target.response);
                            divOut.innerText = settings.message;
                            divOut.style.display = 'block';
                            break;
                        case 'toast':
                            if (evt.type === 'load')
                                createToast(settings.title || "Success", TOAST_ERROR, reason || settings.message);
                            break;
                    }
                }
            })
        })
    } else console.error("invalid btn or form : " + btnID)
}

function loadToastSession() {
    const session = sessionStorage.getItem('ns-toast');
    if (session) {
        const toasts = JSON.parse(session);
        for (let key of Object.keys(toasts)) {
            createToastOPT(toasts[key], key);
        }
    }
}

function createToastOPT(opt, uuid=null) {
    createToast(opt.title, opt.type, opt.message, opt.html || false, uuid);
}

function createToast(title, type, message, html = false, uuid=null) {
    if (!uuid) {
        uuid = uuidv4();
        const opt = {
            "title": title,
            "type": type,
            "message": message
        }
        if (html) opt["html"] = true;

        const session = JSON.parse(sessionStorage.getItem('ns-toast') || "{}");
        session[uuid] = opt;
        sessionStorage.setItem('ns-toast', JSON.stringify(session));
    }

    let container = _('#ns-toast-container');
    if (!container) {
        container = create('div', 'ns-toast-container', document.body, 'ns-toast-container-style')
    }

    const toast = create('div', null, container, 'ns-toast', "ns-text-black");
    const header = create('div', null, toast, 'ns-toast-header');
    const status = create('div', null, header, 'ns-toast-status');
    switch (type) {
        case TOAST_ERROR:
            status.style.backgroundColor = '#dc3545';
            break;
        case TOAST_INFO:
            status.style.backgroundColor = '#0dcaf0';
            break;
        case TOAST_WARN:
            status.style.backgroundColor = '#ffc107';
            break;
        case TOAST_SUCCESS:
        default:
            status.style.backgroundColor = '#198754';
            break;
    }
    create('strong', null, header).innerText = title;
    const close = create('button', null, header, 'btn-close');
    close.ariaLabel = 'closeLabel';
    close.id = uuid;
    close.addEventListener("click", (ev) => {
        ev.target.closest('.ns-toast').remove();
        const session = JSON.parse(sessionStorage.getItem('ns-toast') || "{}");
        if (session) {
            delete session[ev.target.id];
            sessionStorage.setItem('ns-toast', JSON.stringify(session));
        }
    });
    const footer = create('div', null, toast, 'ns-toast-footer');
    if (html)
        footer.innerHTML = message;
    else
        footer.innerText = message;
}
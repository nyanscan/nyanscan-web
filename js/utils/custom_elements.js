class ApiDataBlock extends HTMLElement {

    isInit = false;
    dataLoad = false;
    isError = false;
    error = [];
    rawData = [];

    static get observedAttributes() {
        return ['href'];
    }

    get type() {
        return this.getAttribute('type') || undefined;
    }

    get href() {
        return this.getAttribute('href') || undefined;
    }

    set href(v) {
        this.setAttribute('href', v);
    }

    // raw_data;
    // type;

    constructor() {
        super();
    }

    getField(field) {
        if (!this.dataLoad) return undefined;
        let current = this.rawData;
        for (const key of field.split('.')) {
            if (key === '') break;
            current = current[key];
            if (current === undefined) return undefined;
        }
        return current.toString();
    }

    connectedCallback() {
        if (!this.isInit) {
            this.isInit = true;
            this.refresh();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isInit && name==='href' && oldValue !== newValue) this.refresh();
    }

    refresh() {
        if (this.href) {
            this.dataCallBack(sendApiGetFetch(this.href));
        }
    }

    dataCallBack(promise) {
        promise.then(data => {
            this.rawData = data;
        }).catch(err => {
            this.error = {code: err?.status||-1, message: err?.statusText||'ConnexionError'};
            this.isError = true;
        }).finally(() => {
            this.dataLoad = true;
            this.dispatchEvent(new CustomEvent('dataLoad', {
                cancelable: false,
                bubbles: true,
                composed: false,
                detail: {
                    isError: this.isError,
                    raw: this.rawData
                }
            }));
            this.replaceAttrVar();
        })
    }

    replaceAttrVar() {
        const elements = this.querySelectorAll('.ns-data-field-var');
        const regex = /\$([^$]*)\$/g;
        let matches;
        for (let element of elements) {
            for (let attr of element.getAttributeNames()) {
                let value = element.getAttribute(attr);
                //nex_value was redundant (?)
                while (matches = regex.exec(value)) {
                    let filedV = '';
                    if (matches[1].startsWith('%picture%.')) {
                        filedV = image_id_to_patch(this.getField(matches[1].substr(10)));
                    }
                    else filedV = this.getField(matches[1]);
                    if (filedV) {
                        element.setAttribute(attr, value.replace(matches[0], filedV));
                    }
                }
            }
        }
    }
}

window.customElements.define('ns-api-data-block', ApiDataBlock);

class ApiData extends HTMLElement {
    isInit = false;
    dataLoad = false;
    block;

    get field() {
        return this.getAttribute('field') || undefined;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.isInit) {
            this.isInit = true;
            this.block = this.closest('ns-api-data-block');
            if (!this.block) {
                console.warn('A api-data must be in api-data-block !');
            } else  {
                if (this.block.dataLoad) {
                    this.innerText = this.block.getField(this.field || '');
                } else {
                    this.block.addEventListener('dataLoad', this.setData.bind(this))
                }
            }
        }
    }

    setData() {
        if (!this.block.isError)
            this.innerText = this.block.getField(this.field || '');
    }
}

window.customElements.define('ns-api-data', ApiData);

class NSAnchor extends HTMLElement {

    get href() {
        return this.getAttribute('href') || undefined;
    }

    set href(value) {
        this.setAttribute('href', value);
    }

    constructor() {
        super();
    }
    connectedCallback() {
        this.addEventListener('click', (function (e) {
            e.preventDefault();
            window.APP.changePage(this.href);
        }).bind(this))
    }
}
window.customElements.define('ns-a', NSAnchor);

class NSPagination extends HTMLElement {

    static get observedAttributes() {
        return ['min', 'max', 'value', 'max-show', 'first', 'last', 'placeholder', 'disabled'];
    }

    isConnect = false;
    nextLi = undefined;
    UL = undefined;
    tmpPlaceHolder = false;

    setter(name, v, isBool) {
        if (isBool) {
            if (v) this.setAttribute(name, name);
            else this.removeAttribute(name);
        } else {
            if (v === '' || v === undefined || v === null) this.removeAttribute(name);
            else this.setAttribute(name, v);
        }
    }

    getter(name, isBool) {
        return isBool ? this.hasAttribute(name) : this.getAttribute(name);
    }

    get max() {
        return this.getter('max', false)
    }

    get min() {
        return this.getter('min', false)
    }

    get value() {
        return this.getter('value', false)
    }

    get max_show() {
        return this.getter('max-show', false)
    }

    get placeholder() {
        return this.getter('placeholder', true)
    }

    get disabled() {
        return this.getter('disabled', true) || this.getter('placeholder', true);
    }

    get first() {
        return this.getter('first', true)
    }

    get last() {
        return this.getter('last', true)
    }

    set max(v) {
        this.setter('max', v, false);
    }

    set min(v) {
        this.setter('min', v, false);
    }

    set value(v) {
        this.setter('value', v, false);
    }

    set max_show(v) {
        this.setter('max-show', v, false);
    }

    set placeholder(v) {
        this.setter('placeholder', v, true);
    }

    set disabled(v) {
        this.setter('disabled', v, true);
    }

    set first(v) {
        this.setter('first', v, true);
    }

    set last(v) {
        this.setter('last', v, true);
    }

    constructor() {
        super();

        this.innerHTML = `
            <nav aria-label="Pagination">
                <ul class="nsp-ul">
                    <li class="nsp-before">
                        <button nsp-att-page="b">Précédent</button>
                    </li>
                    
                    <li class="nsp-next">
                        <button nsp-att-page="n">Suivant</button>
                    </li>
                </ul>
            </nav>
        `;
        this.nextLi = this.getElementsByClassName('nsp-next')[0];
        this.UL = this.getElementsByClassName('nsp-ul')[0];

        // listener
        this.addEventListener('click', this.cOnClick.bind(this));

    }

    cOnClick(e) {
        e.preventDefault();
        if (this.disabled) return;
        if (e.target.tagName === "BUTTON" && e.target.hasAttribute('nsp-att-page')) {
            let min = parseInt(this.min), max = parseInt(this.max);
            if (isInt(this.min) && isInt(this.max)) {
                let value = isInt(this.value) ? parseInt(this.value) : min;
                value = Math.max(min, Math.min(max, value));
                let needTrigger = false;
                const page = e.target.getAttribute('nsp-att-page');
                if (page === 'b') {
                    if (value > min) {
                        value--;
                        needTrigger = true;
                    }
                } else if (page === 'n') {
                    if (value < max) {
                        value++;
                        needTrigger = true;
                    }
                } else if (isInt(page)) {
                    value = Math.max(min, Math.min(max, page||0));
                }
                if (needTrigger) {
                    this.value = value;
                    this.dispatchEvent(new CustomEvent('change', {
                        cancelable: false,
                        bubbles: true,
                        composed: false,
                        detail: {
                            value: value,
                        }
                    }));
                }
            }
        }
    }

    connectedCallback() {
        this.isConnect = true;
        this.setupCount();
        this.fixStatus();
    }

    createPageBTN(value) {
        const li = create('li', null, null, 'nsp-page');
        const v = create('button', null, li);
        v.innerText = value;
        if (this.disabled) v.disabled = true;
        v.setAttribute('nsp-att-page', value);
        this.UL.insertBefore(li, this.nextLi);
    }

    setupCount() {
        this.querySelectorAll('.nsp-page').forEach(v => v.remove());
        let min = parseInt(this.min), max = parseInt(this.max);
        if (this.tmpPlaceHolder) this.placeholder = false;
        if (!this.placeholder && isInt(this.min) && isInt(this.max)) {
            if (min > max) {
                let tmp = max;
                max = min;
                min = tmp;
            }
            let value = isInt(this.value) ? parseInt(this.value) : min;
            value = Math.max(min, Math.min(max, value));
            let max_show = isInt(this.max_show) ? parseInt(this.max_show) : 10;
            let before = Math.min(Math.floor((max_show - 1) / 2), value - min);
            let after = max_show - 1 - before;
            if (value + after > max) {
                after = max - value;
                before = max_show - 1 - after;
            }
            if (this.first && min !== value) {
                before--;
                this.createPageBTN(min);
            }
            for (let i = Math.max(value - before, min); i < (value + after); i++) this.createPageBTN(i);
            if (this.last) this.createPageBTN(max);
            else this.createPageBTN(value + after);
        } else if (!this.placeholder) {
            this.tmpPlaceHolder = true;
            this.placeholder = true;
        }
        if (this.placeholder) this.setHolder();
    }

    setHolder() {
        let max_show = isInt(this.max_show) ? parseInt(this.max_show) : 10;
        for (let i = 0 ; i < max_show ; i++) this.createPageBTN('h');
    }

    fixStatus() {
        const disabled = this.disabled;
        let min = parseInt(this.min), max = parseInt(this.max);
        if (isInt(this.min) && isInt(this.max)) {
            let value = isInt(this.value) ? parseInt(this.value) : min;
            value = Math.max(min, Math.min(max, value));
            this.querySelectorAll('button[nsp-att-page]').forEach(v => {
                const page = v.getAttribute('nsp-att-page');
                if (page === 'b')  v.disabled = value === min || disabled;
                else if (page === 'n')  v.disabled = value === max || disabled;
                else if (isInt(page)) {
                    v.disabled = parseInt(page) === value || disabled;
                    if (parseInt(page) === value) {
                        if (!v.classList.contains('nsp-current')) v.classList.add('nsp-current');
                    } else {
                        if (v.classList.contains('nsp-current')) v.classList.remove('nsp-current');
                    }
                }
            });
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnect && name !== 'placeholder') {
            if (name === 'disabled') this.fixStatus();
            else {
                this.setupCount();
                this.fixStatus();
            }
        }
    }

}

window.customElements.define('ns-pagination', NSPagination);
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

    set href($v) {
        this.setAttribute('href', $v);
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
            sendApiGetRequest(this.href, this.dataCallBack.bind(this));
        }
    }

    dataCallBack(event) {
        this.dataLoad = true;
        const code = checkApiResStatus(event);
        if (code === API_REP_OK) {
            try {
                this.rawData = getDataAPI(event);
            } catch (error) {
                this.error = {code: -1, message: 'parseError'};
                this.isError = true;
            }
        } else {
            this.isError = true;
            if (code === API_REP_BAD) {
                this.error = {code: event.target.status, message: getAPIErrorReason(event)};
            } else {
                this.error = {code: -1, message: 'ConnexionError'};
            }
        }

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
            window.APP.changePage(this.href);
        }).bind(this))
    }
}

window.customElements.define('ns-a', NSAnchor);
class ApiDataBlock extends HTMLElement {

    isInit = false;
    dataLoad = false;
    isError = false;
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

        if (event.type === 'load' && event.target.status >= 200 && event.target.status < 300) {
            try {
                this.rawData = JSON.parse(event.target.responseText)["data"];
                this.dispatchEvent(new CustomEvent('dataLoad', {
                    cancelable: false,
                    bubbles: true,
                    composed: false,
                    detail: {
                        raw: this.rawData
                    }
                }));

            } catch (error) {
                this.isError = true;
            }
        } else this.isError = true;
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
        this.innerText = this.block.getField(this.field || '');
    }
}

window.customElements.define('ns-api-data', ApiData);

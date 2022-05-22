class AdminTable extends Component {

    baseURL;
    colum;
    id;

    idCol;

    // search_v = '';
    order_v = '';
    reverse = false;
    page=0;
    amountView=25;
    maxPages=1;
    current_colum;

    block;
    thead;
    tbody;
    pagination;
    selectAmount;
    columSettings;
    totalAmountSpan;

    colCallback;

    get raw() {
        return `
<div class="ns-adm-table">
    <div class="ns-adm-table-settings">
        <select id="${this.id}-table-select-amount" class="ns-adm-table-settings-amount">
            <option value="25">Elléments par page: 25</option>
            <option value="50">Elléments par page: 50</option>
            <option value="75">Elléments par page: 75</option>
            <option value="100">Elléments par page: 100</option>
            <option value="150">Elléments par page: 150</option>
            <option value="200">Elléments par page: 200</option>
        </select>
         <nav aria-label="Page navigatione" class="${this.id}-table-pagination ns-adm-table-settings-pagination">
            <button type="button" class="ns-table-previous">Previous</button>
            <div><span class="device-pages text-white"></span></div>
            <button type="button" class="ns-table-next"">Next</button>
        </nav>
<!--        <a href="/device_view_edit" class="device-view-settings-add"><i class="bi bi-plus-circle"></i> Create</a>-->
        <div class="ns-adm-table-total-amount"><span id="${this.id}-table-total-amount"></span></div>
    </div>
    <div id="${this.id}-table-colum" class="ns-adm-table-settings-col">

    </div>
        <ns-api-data-block id="${this.id}-data-block">
        <table class="table table-dark table-striped table-hover">
            <thead>
                <tr id="${this.id}-admin-thead">
                </tr>
            </thead>
            <tbody id="${this.id}-admin-tbody">

            </tbody>
        </table>
    </ns-api-data-block>
</div>
        `;
    }

    constructor(app, id, colum, baseURL, colCallback) {
        super(app, COMPONENT_TYPE_FLOAT);
        this.id = id;
        this.colum = colum;
        this.current_colum = colum.filter(col => col.isDefault).map(col => col.name);
        console.log(this.current_colum);
        this.baseURL = baseURL;
        this.colCallback = colCallback;
        this.idCol = colum.find(e => e.isPrimary).name;
    }

    build(parent) {
        super.build(parent);

        this.block = _('#' + this.id + '-data-block');
        // this.search = _(this.id + '-mac-search');
        this.tbody = _('#' + this.id + '-admin-tbody');
        this.thead = _('#' + this.id + '-admin-thead');
        this.totalAmountSpan = _('#' + this.id + '-table-total-amount');
        this.columSettings = _('#' + this.id + '-table-colum');
        this.pagination = _('.' + this.id + '-table-pagination');
        this.selectAmount = _('#' + this.id + '-table-select-amount');

        this.block.addEventListener('dataLoad', this.setup.bind(this));
        this.setupColumnBtn();
        this.setupPagination();
        this.updateAmount(null, true);
        this.update();

    }

    setupColumnBtn() {
        for (let col of this.colum) {
            const div = create('div', null, this.columSettings, 'form-check');
            const e = create('input', col.name + '-c-settings', div, 'btn-check');
            e.autocomplete = 'off';
            e.type = 'checkbox';
            e.checked = this.current_colum.includes(col.name);
            e.disabled = col.force;
            e.colName = col.name
            e.addEventListener('change', this.changeColum.bind(this));
            createPromise('label', null, div, 'btn', 'btn-outline-secondary').then(l => {
                l.setAttribute('for', col.name + '-c-settings');
                l.innerText = col.display;
            })
        }
    }

    setup() {
        this.tbody.innerHTML = '';
        this.thead.innerHTML = '';
        createPromise('th', null, this.thead).then(e => e.innerHTML = '#');
        for (let col of this.colum) {
            if (this.current_colum.includes(col.name)) {
                createPromise('th', null, this.thead, 'cursor-pointer').then(e => {
                    e.innerHTML = col.display;
                    e.onclick = this.order.bind(this, col.name);
                })
            }
        }
        createPromise('th', null, this.thead).then(e => e.innerHTML = 'Actions');
        let cpt = 0;
        let value = undefined;
        for (const raw_row of this.block.rawData["element"]) {
            value = create('tr', 'element-' + raw_row['idCol'], this.tbody);
            this.setup_row(raw_row, value, cpt);
            cpt++;
        }
        if (this.pagination) this.updatePagination(this.block.rawData["total_count"]);
        if (this.totalAmountSpan) this.totalAmountSpan.innerText = `Total: ${this.block.rawData["total_count"]}`;
    }

    setup_row(data, row, cpt) {
        row.innerHTML = '';
        createPromise('th', null, row).then(e => e.innerHTML = (cpt + this.page * this.amountView));
        for (let col of this.colum) {
            if (this.current_colum.includes(col.name)) {
                createPromise('td', null, row).then(e => {
                    if (col.needCallback) {
                        this.colCallback(col.name, e, data[col.name]||col.default, data);
                    }
                    else if (col.href === undefined) {
                        e.innerHTML = data[col.name]||col.default;
                    } else {
                        const anchor = create('a', null, e);
                        anchor.innerHTML = data[col.name]||col.default;
                        if (data[col.name] !== undefined) anchor.href = col.href + data[col.name];
                    }
                });
            }
        }

        createPromise('td', null, row).then(e => this.colCallback('action', e, null, data));
    }

    setupPagination() {
        for (let paginationElement of this.pagination) {
            for (let prev of paginationElement.getElementsByClassName('device-previous')) {
                prev.onclick = this.changePage.bind(this, false);
            }
            for (let next of paginationElement.getElementsByClassName('device-next')) {
                next.onclick = this.changePage.bind(this, true);
            }
        }
    }

    updatePagination(total_count) {
        this.maxPages = Math.ceil(total_count / this.amountView);

        for (let paginationElement of this.pagination) {
            for (let prev of paginationElement.getElementsByClassName('device-previous')) {
                prev.disabled = this.page === 0;
            }
            for (let next of paginationElement.getElementsByClassName('device-next')) {
                next.disabled = this.page === this.maxPages - 1;
            }
            for (let info of paginationElement.getElementsByClassName('device-pages')) {
                info.innerHTML = `${(this.page + 1)}`;
            }
        }
    }

    changePage(next) {
        if (next && this.page < this.maxPages - 1) {
            this.page++;
            this.update();
        } else if (!next && this.page > 0) {
            this.page--;
            this.update();
        }
    }

    updateAmount(e, first=false) {
        if (this.selectAmount !== undefined) this.amountView=parseInt(this.selectAmount.value) || 100;
        this.page = 0;
        if (!first) this.update();
    }

    changeColum() {
        this.current_colum = [];
        for (let colS of this.columSettings.querySelectorAll('input[type=checkbox]')) {
            if (colS.checked && colS.colName) this.current_colum.push(colS.colName);
        }
        this.setup();
    }

    order(row) {
        if (this.order_v === row) {
            if (this.reverse) this.order_v = '';
            else this.reverse = true;
        }
        else {
            this.reverse = false;
            this.order_v = row;
        }
        this.update();
    }

    update() {
        let path = this.baseURL + '?';
        // const limit = 50;
        // if (this.args) path += this.args + '&';
        path += 'limit=' + this.amountView;
        path += '&offset=' + (this.amountView * this.page);
        // if (this.search_v) path += '&mac=' + this.search_v;
        if (this.order_v) path += '&order=' + this.order_v;
        if (this.reverse) path += '&reverse=1';
        this.block.href = path;
    }

}

class SimpleTablePages extends Pages {

    admTable;

    get raw() {
        return `<section class="flex-grow-1 px-5 py-3" id="ns-simple-adm-table">`;
    }

    constructor(app) {
        super(app);
        this.admTable = null;
    }

    setTable(table) {
        this.admTable = table;
    }

    build(parent, vars) {
        super.build(parent, vars);
        this.admTable.build(_('#ns-simple-adm-table'));
    }


}

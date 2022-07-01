class CreateCarouselBtn  extends Component {

    editData;

    get raw() {
        return `
        <form id="nsa-add-carousel-form">
            <h3>${this.editData ? 'Modifier' : 'Ajouter'} un élément au carousel </h3>
            <div class="d-flex flex-column my-3 gap-3">
                <input class="form-control" type="file" name="picture" accept="image/png,image/jpeg,image/webp" ${this.editData ? 'disabled style="display: none;"' : 'required'}>
                <div class="form-floating">
                    <input id="nsa-add-carousel-href" class="form-control" type="text" name="title" ${this.editData ? `value=${this.editData['title']||''}` : ''}>
                    <label for="nsa-add-carousel-href">Titre</label>
                </div>
                <div class="form-floating">
                    <input id="nsa-add-carousel-href" class="form-control" type="text" name="href" ${this.editData ? `value=${this.editData['href']||''}` : ''}>
                    <label for="nsa-add-carousel-href">HREF</label>
                </div>
                <div class="form-floating">
                    <input id="nsa-add-carousel-priority" class="form-control" type="number" min="-127" max="127" name="priority" ${this.editData ? `value=${this.editData['priority']}` : 'value="0"'} required>
                    <label for="nsa-add-carousel-priority">Priorité</label>
                </div>
            </div>
            <div class="ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
                <button type="submit" class="btn-success">${this.editData ? 'Modifier' : 'Ajouter'}</button>
            </div>
        </form>
        `;
    }

    constructor(app, editData = null) {
        super(app, COMPONENT_TYPE_MODAL);
        this.editData = editData;
    }

    build(parent) {

        super.build(parent);
        _('#nsa-add-carousel-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            if (this.editData) {
                sendApiPostFetch('admin/edit/carousel/' + this.editData['picture'] + '?href=' + encodeURI(fd.get('href')) + '&title=' + encodeURI(fd.get('title')) + '&priority=' + fd.get('priority')).finally(() => window.APP.closeModal())
            }
            else sendApiPostFetch('admin/carousel', fd).then(() => window.APP.closeModal()).catch(r => window.APP.openInfoModal(TYPE_ERROR, 'Erreur forumulaire', r.reason ? r.reason.map(e => `<p>${e}</p>`) : '<p>Internal error</p>', true));
        })
    }
}

export default class extends SimpleTablePages {
    COLUMN = [
        {name: 'picture', display: 'Image', force: true, default: 'null', isDefault: true, isPrimary: true, isSearchable: true},
        {name: 'title', display: 'Titre', force: false, default: 'null', isDefault: true, isSearchable: true},
        {name: 'href', display: 'HREF', force: false, default: 'null', isDefault: true, isSearchable: true},
        {name: 'priority', display: 'Priorité', force: false, default: '0', isDefault: true},
        {name: 'disable', display: 'Activé', force: false, default: true, isDefault: true, needCallback: true},
        {name: 'date_inserted', display: 'Date de création', force: false, default: 'jamais', isDefault: true}
    ];

    constructor(app) {
        super(app);
        this.setTable(new AdminTable(app, 'project', this.COLUMN, 'admin/carousel', this.collCallback.bind(this), {isBtn: true}));
    }

    build(parent, vars) {
        super.build(parent, vars);

        this.admTable.createBTN.addEventListener('click', () => {
            window.APP.openModal(new CreateCarouselBtn(window.APP));
        })

    }

    collCallback(name, e, value, rowData) {
        super.collCallback(name, e, value, rowData);
        if (name === 'action') {
            const group = create('div', null, e, 'btn-group');
            group.role = 'group';
            group.ariaLabel = 'Action button';
            createPromise('button', null, group, 'btn', 'btn-sm', 'btn-info').then(btn => {
                btn.ariaLabel = 'View';
                btn.setAttribute('data-bs-toggle', 'tooltip');
                btn.title = 'Voir';
                create('i', null, btn, 'bi', 'bi-eye');
                btn.addEventListener('click', this.showImage.bind(this, rowData['picture']));
            })
            createPromise('button', null, group, 'btn', 'btn-sm', 'btn-warning').then(btn => {
                btn.ariaLabel = 'Edit';
                btn.setAttribute('data-bs-toggle', 'tooltip');
                btn.title = 'Modifier';
                create('i', null, btn, 'bi', 'bi-pencil');
                btn.addEventListener('click', this.openEdit.bind(this, rowData));
            })
        } else if (name === 'disable') {
            const div = create('div', null, e, "form-check", "form-switch");
            const input = create('input', null, div, 'form-check-input');
            input.type = 'checkbox';
            input.role = 'switch';
            input.picture_id = rowData["picture"];
            input.addEventListener('click', this.switchStatus.bind(this));
            if (value === '0') input.checked = 'checked';
        }
    }

    switchStatus(e) {
        e.preventDefault();
        console.log(e.target.checked);
        sendApiPostFetch('admin/edit/carousel/' + e.target.picture_id + '?' + (e.target.checked ? 'enable=1' : 'disable=1')).finally((() => this.admTable.refresh()).bind(this) );
    }

    openEdit(data) {
        this.app.openModal(new CreateCarouselBtn(this, data));
    }

    showImage(id) {
        this.app.openInfoModal(TYPE_INFO, id, `<img src="${image_id_to_path(id)}">`, true);
    }

}
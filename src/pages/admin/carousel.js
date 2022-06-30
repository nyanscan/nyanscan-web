class CreateCarouselBtn  extends Component {

    get raw() {
        return `
        <form id="nsa-add-carousel-form">
            <h3>Ajouter un élément au carousel </h3>
            
            <input type="file" name="picture" accept="image/png,image/jpeg,image/webp" required>
            <input type="text" name="href">
            <input type="number" min="-127" max="127" name="priority" required value="0">
            
            <div class="ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
                <button type="submit" class="btn-success">Ajouter</button>
            </div>
        </form>
        `;
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_MODAL);
    }

    build(parent) {
        super.build(parent);
        _('#nsa-add-carousel-form').addEventListener('submit', (e) => {
            e.preventDefault();
            sendApiPostFetch('admin/carousel', new FormData(e.target)).then(() => window.APP.closeModal()).catch(r => window.APP.openInfoModal(TYPE_ERROR, 'Erreur forumulaire', r.reason ? r.reason.map(e => `<p>${e}</p>`) : '<p>Internal error</p>', true));
        })
    }
}

export default class extends SimpleTablePages {
    COLUMN = [
        {name: 'picture', display: 'Image', force: true, default: 'null', isDefault: true, isPrimary: true, isSearchable: true},
        {name: 'href', display: 'HREF', force: false, default: 'null', isDefault: true, isSearchable: true},
        {name: 'priority', display: 'Priorité', force: false, default: '0', isDefault: true},
        {name: 'disable', display: 'Desactivé', force: false, default: true, isDefault: true},
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
        }
    }

    showImage(id) {
        this.app.openInfoModal(TYPE_INFO, id, `<img src="${image_id_to_path(id)}">`, true);
    }

}
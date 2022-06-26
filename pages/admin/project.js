class ModalEditStatus extends Component {

    id;

    get raw() {
        return `
        <form id="nsa-modal-pform">
            <h3>Changer le statut du projet n° ${this.id} ? </h3>
            <div class="ns-form-group">
            <input type="hidden" hidden="hidden" name="project" value="${this.id}">
            <label for="nsa-mdoal-ps" class="form-label">Status</label>
                <select id="nsa-mdoal-ps" name="status" class="form-select">
                    <option value="0">En attente de vérification.</option>
                    <option value="1" >Rejeté.</option>
                    <option value="2" selected>Accepté, en attente de contenu.</option>
                    <option value="3">Publié.</option>
                </select>
            </div>
            <div class="ns-form-group">
                <label for="nsa-mdoal-pr" class="form-label">Raison</label>
                <textarea id="nsa-mdoal-pr" name="reason" rows="4" maxlength="255" class="form-control"></textarea>
                <div class="form-text">Raison de la modification</div>
            </div>
            <div class="ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
                <button type="submit" class="bg-danger">Modifier</button>
            </div>
        </form>
        `;
    }

    build(parent) {
        super.build(parent);
        _('#nsa-modal-pform').addEventListener('submit', this.sendRequest.bind(this));

    }

    constructor(app, id) {
        super(app, COMPONENT_TYPE_MODAL);
        this.id = id;
    }

    sendRequest(event) {
        event.preventDefault();
        loadingScreen(true);
        this.app.closeModal();
        sendApiPostRequest('project/validation', new FormData(event.target), (e) => {
            loadingScreen(false);
        })
    }
}

export default class extends SimpleTablePages {

    COLUMN = [
        {name: 'id', display: 'ID', force: true, default: 'null', isDefault: true, isPrimary: true},
        {name: 'author', display: 'Auteur', force: false, default: 'null', isDefault: true, href: '', isSearchable: true},
        {name: 'picture', display: 'Vignette', force: false, default: 'null', isDefault: true, href: ''},
        {name: 'title', display: 'Titre', force: false, default: 'null', isDefault: true, isSearchable: true},
        {name: 'description', display: 'Description', force: false, default: 'null'},
        {name: 'reading_direction', display: 'Sens De lecture', force: false, default: '0', needCallback: true},
        {name: 'format', display: 'Format', force: false, default: '0', needCallback: true},
        {name: 'status', display: 'Status', force: false, default: '0', needCallback: true,  isDefault: true},
        {name: 'date_inserted', display: 'Créé le', force: false, default: 'never'}
    ];

    constructor(app) {
        super(app);
        this.setTable(new AdminTable(app, 'project', this.COLUMN, 'project/all', this.collCallback.bind(this)));
    }

    collCallback(name, e, value, rowData) {
        switch (name) {
            case 'reading_direction':
                e.innerText = value === '1' ? 'japonais' : 'Classique';
                break;
            case 'format':
                e.innerText = value === '1' ? 'Série' : 'One-shot';
                break;
            case 'status':
                e.innerHTML = project_status_to_html(value);
                break;
            case 'action':
                const group = create('div', null, e, 'btn-group');
                group.role = 'group';
                group.ariaLabel = 'Action button';
                createPromise('button', null, group, 'btn', 'btn-info', 'btn-sm').then((btn) => {
                    btn.ariaLabel = 'Edit';
                    btn.setAttribute('data-bs-toggle', 'tooltip');
                    btn.title = 'Modifier le status';
                    btn.type = "button";
                    btn.addEventListener('click', this.openChangeStatusModal.bind(this, rowData['id']));
                    create('i', null, btn, 'bi', 'bi-pencil');
                });
                createPromise('ns-a', null, group, 'btn', 'btn-success', 'btn-sm').then((btn) => {
                    btn.ariaLabel = 'View';
                    btn.setAttribute('data-bs-toggle', 'tooltip');
                    btn.title = 'Voir les tomes';
                    btn.href = '/volume/' + rowData['id'];
                    create('i', null, btn, 'bi', 'bi-eye');
                });
                break;
        }
    }
    
    openChangeStatusModal(id) {
        this.app.openModal(new ModalEditStatus(this.app, id));
    }
}
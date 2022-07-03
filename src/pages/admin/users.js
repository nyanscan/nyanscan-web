class ModalEditStatus extends Component {

    id;
    name;
    perms;
    perm;

    get raw() {
        let html = `
        <form id="nsa-modal-uperm-form">
            <h3>Changer les permissions de l'utilisateur n°${this.id} (${this.name}) ? </h3>
            <div class="ns-form-group">
                <input type="hidden" hidden="hidden" name="user" value="${this.id}">
                <select id="nsa-mdoal-uperm" name="permission" class="form-select">`
            
                for (const permKey in this.perms) {
                    html += `<option value="${this.perms[permKey]}" ${(this.perm === 255 || this.perm > this.perms[permKey]) ? '' : 'disabled'}>${permKey}</option>`;
                }
            
                html += `
                </select>
            </div>
            <div class="mt-3 ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
                <button type="submit" class="bg-warning">Modifier</button>
            </div>
        </form>
        `;
        return html;
    }

    build(parent) {
        super.build(parent);
        _('#nsa-modal-uperm-form').addEventListener('submit', this.sendRequest.bind(this));
    }

    constructor(app, id, name, perms, perm) {
        super(app, COMPONENT_TYPE_MODAL);
        this.id = id;
        this.name = name;
        this.perms = perms;
        this.perm = perm;
    }

    sendRequest(event) {
        event.preventDefault();
        loadingScreen(true);
        this.app.closeModal();
        sendApiPostRequest('user/permission', new FormData(event.target), (e) => {
            loadingScreen(false);
        })
    }
}

export default class extends SimpleTablePages {

    PERMISSION = {
        "Administrateur": 255,
        "Moderateur": 200,
        "vip": 100,
        "Default": 1
    }

    COLUMN = [
        {name: 'id', display: 'ID', force: true, default: 'null', isDefault: true, isPrimary: true},
        {name: 'username', display: 'Pseudo', force: false, default: 'null', isDefault: true, href: '', isSearchable: true},
        {name: 'email', display: 'E-mail', force: false, default: 'null', isDefault: true, isSearchable: true},
        {name: 'birthday', display: 'Anniversaire', force: false, default: 'null'},
        {name: 'status', display: 'Statut', force: false, default: '0'},
        {name: 'permission', display: 'Permission', force: false, default: '0', isDefault: true, needCallback: true, isSearchable: true},
        {name: 'date_inserted', display: 'Créé le', force: false, default: 'never'},
        {name: 'date_updated', display: 'Dernière connection', force: false, default: 'never'}
    ];

    constructor(app) {
        super(app);
        this.setTable(new AdminTable(app, 'project', this.COLUMN, 'user/all', this.collCallback.bind(this)));
    }

    collCallback(name, e, value, rowData) {
        switch (name) {
            case 'permission':

                e.innerText = this.getStringPermission(value);
                e.style.color = hexColorToCSSColor(pickHex( [14, 142, 207], [255, 0, 119],(parseFloat(value)||0.) / 255.));
                break;
            case 'action':
                const group = create('div', null, e, 'btn-group');
                group.role = 'group';
                group.ariaLabel = 'Action button';
                createPromise('button', null, group, 'btn', 'btn-info', 'btn-sm').then((btn) => {
                    btn.ariaLabel = 'Edit perm';
                    btn.setAttribute('data-bs-toggle', 'tooltip');
                    btn.title = 'Modifier les permission';
                    btn.type = "button";
                    const perm = parseInt(this.app.user.data["permission"]);
                    if (perm === 255 || perm > rowData["permission"]) {
                        btn.addEventListener('click', this.openChangePermissionModal.bind(this, rowData['id'], rowData["username"]));
                    } else {
                        btn.disabled = true;
                    }
                    create('i', null, btn, 'bi', 'bi-pencil');
                });
                break;
        }
    }

    getStringPermission($permission) {
        $permission = parseInt($permission)||0;
        let last = 'Default';
        let lastValue = 0;
        for (const permName in this.PERMISSION) {
            let value = this.PERMISSION[permName]
            if ($permission === value) {
                return permName;
            } else if ($permission > value &&  value > lastValue) {
                last = permName;
                lastValue = value;
            }
        }
        return last + '+';
    }

    openChangePermissionModal(id, name) {
        this.app.openModal(new ModalEditStatus(this.app, id, name, this.PERMISSION, this.app.user.data["permission"]));
    }
}
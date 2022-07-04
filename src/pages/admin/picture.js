export default class extends SimpleTablePages {
    COLUMN = [
        {name: 'id', display: 'ID', force: true, default: 'null', isDefault: true, isPrimary: true, isSearchable: true},
        {name: 'author', display: 'Auteur', force: false, default: '0', isDefault: true, isSearchable: true},
        {name: 'title', display: 'Titre', force: false, default: '', isDefault: true, isSearchable: true},
        {name: 'date_inserted', display: 'Date de création', force: false, default: 'jamais', isDefault: true}
    ];

    constructor(app) {
        super(app);
        this.setTable(new AdminTable(app, 'project', this.COLUMN, 'admin/picture', this.collCallback.bind(this)));
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
                btn.addEventListener('click', this.showImage.bind(this, rowData['id']));
            })
        }
    }

    showImage(id) {
        this.app.openInfoModal(TYPE_INFO, id, `<img src="${image_id_to_path(id)}" alt="">`, true);
    }

}
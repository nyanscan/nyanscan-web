export default class extends SimpleTablePages {
    COLUMN = [
        {name: 'root', display: 'ROOT', force: true, default: 'null', isDefault: true, isPrimary: true, isSearchable: true},
        {name: 'visited', display: 'Nombre de visite', force: false, default: '0', isDefault: true},
        {name: 'last', display: 'Dernière', force: false, default: 'jamais', isDefault: true}
    ];

    constructor(app) {
        super(app);
        this.setTable(new AdminTable(app, 'project', this.COLUMN, 'admin/log-root', this.collCallback.bind(this)));
    }
}
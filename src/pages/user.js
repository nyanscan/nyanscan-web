class EditInfoModal extends Component {

    static TYPE_EMAIL = 0;
    static TYPE_PASSWORD = 1;
    static TYPE_USERNAME = 2;
    static TYPE_BIRTHDAY = 3;

    static STRUCT = {
        [EditInfoModal.TYPE_EMAIL]: {name: 'email', api: 'user/edit/email', needConfirmation: true,  fields: [{name: 'email', display: 'E-mail', type: 'email'}]},
        [EditInfoModal.TYPE_PASSWORD]: {name: 'mot de passe', api: 'user/edit/password', needConfirmation: true,  fields: [
            {name: 'password', display: 'Mot de passe', type: 'password'},
            {name: 'password-v', display: 'Confirmation', type: 'password'}
            ]},
        [EditInfoModal.TYPE_USERNAME]: {name: 'nom d\'utilisateur', api: 'user/edit/username', needConfirmation: false,  fields: [{name: 'username', display: 'Nom d\'utilisateur', type: 'text'}]},
        [EditInfoModal.TYPE_BIRTHDAY]: {name: 'date de naissance', api: 'user/edit/birthday', needConfirmation: false,  fields: [{name: 'birthday', display: 'Date de naissance', type: 'date'}]}
    }

    c_type;
    error;

    get raw() {
        return `
         <form id="ns-modal-profile-form">
            <h3>Modifier votre  ${EditInfoModal.STRUCT[this.c_type].name}</h3>
            <div class="alert alert-danger" id="ns-modal-profile-error">
            
            </div>
            <div class="d-flex flex-column my-3 gap-3" id="ns-modal-profile-fields">
               
            </div>
            <div class="ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
                <button type="submit" class="ns-tickle-pink-bg">Modifier</button>
            </div>
        </form>
        `;
    }

    constructor(app, c_type) {
        super(app, COMPONENT_TYPE_MODAL);
        this.c_type = c_type;
        if (EditInfoModal.STRUCT[c_type] === undefined) throw Error('Invalid USER MODAL TYPE');
    }

    createField(parent, data) {
        const div = create('div', null, parent);
        const id = `ns-modal-profile-field-${data.name}`;
        const label = create('label', null, div, 'form-label');
        label.setAttribute('for', id);
        label.innerText = data.display;
        const input = create('input', id, div, 'form-control');
        input.type = data.type;
        input.name = data.name;
    }

    build(parent) {
        console.log('build')
        super.build(parent);
        const fields = _('#ns-modal-profile-fields');
        EditInfoModal.STRUCT[this.c_type].fields.forEach(value => this.createField(fields, value));
        this.createField(fields, {name: 'password-c', display: 'Mot de passe actuelle', type: 'password'});
        this.error = _('#ns-modal-profile-error');
        this.error.style.display = 'none';
        _('#ns-modal-profile-form').addEventListener('submit', this.submit.bind(this));
    }

    submit(e) {
        e.preventDefault();
        loadingScreen(true);
        sendApiPostFetch(EditInfoModal.STRUCT[this.c_type].api, new FormData(e.target)).then(() => {
            if ( EditInfoModal.STRUCT[this.c_type].needConfirmation) {
                this.app.openInfoModal(TYPE_SUCCESS, `Modification de votre ${EditInfoModal.STRUCT[this.c_type].name}`, `Un mail de vérification vous as était envoyé, une fois verifier votre ${EditInfoModal.STRUCT[this.c_type].name} seras modifier.`);
            } else {
                this.app.closeModal();
                this.app.createToast(TYPE_SUCCESS, `Modification de votre ${EditInfoModal.STRUCT[this.c_type].name}`, `Votre  ${EditInfoModal.STRUCT[this.c_type].name} à bien était modifié.`);
            }
        }).catch(r => {
                e.target.reset();
                this.error.style = '';
                if (r.code > 0) {
                    this.error.innerText = r.reason;
                } else this.error.innerText = 'Une erreur est survenue verifier votre connexion.'
            }
        ).finally(() => loadingScreen(false));
    }

}

export default class extends Pages {

    user;
    dataBlock;
    isSelf;

    get raw() {
        let html = `
        <section>
            <ns-api-data-block id="ns-profile-data" href="user/${this.user}?details=1">
                <div class="ns-min-vh-100 ns-center py-5 ns-text-black">
                    <div class="ns-scan-preview-profil">
                        <section class="flex-column flex-md-row d-flex">
                            <div class="col-md-8 d-flex justify-content-start align-items-center gap-3">
                                <div class="p-2">
                                    <img src="/res/profile.webp" alt="profilePhoto" class="ns-avatar img-responsive">
                                </div>
                                <div class="p-2">
                                    <h3><ns-api-data field="username"></ns-api-data></h3>
                                    <span><ns-api-data field="age"></ns-api-data> ans</span>
                                </div>
                            </div>
                            <div class="d-flex flex-column justify-content-end">
                                <div class="p-2">
                                    <ns-a  href="user/${this.user}/projet">Voir mes projets</ns-a>
                                </div>
                                <div class="p-2">
                                    <span> Rejoint le <ns-api-data field="join"></ns-api-data></span>
                                </div>
                                <div class="p-2">
                                    <span> Dernière activité <ns-api-data field="last_sean"></ns-api-data></span>
                                </div>
                            </div>
                        </section>
                        <div class="ns-center py-5 ns-text-white">
                            <div class="ns-section-block ns-b-purple-gradient">
                                <h4 class="ns-scan-preview-tile">Scans aimés</h4>
                                <div id="ns-user-like" class="ns-scan-preview-elements">
                                    <ns-project></ns-project>
                                    <ns-project></ns-project>
                                    <ns-project></ns-project>
                                    <ns-project></ns-project>
                                </div>
                            </div>
                        </div>
                        <div class="ns-center py-5 ns-text-white">
                            <div class="ns-section-block ns-b-purple-gradient">
                                <h4>Scans uploadés</h4>
                                <div id="ns-user-upload" class="ns-scan-preview-elements">
                                    <ns-project></ns-project>
                                    <ns-project></ns-project>
                                    <ns-project></ns-project>
                                    <ns-project></ns-project>
                                </div>
                            </div>
                        </div>
        `
        if (this.isSelf) {
            html += `
                <div class="ns-center py-5 ns-text-white ">
                    <div class="ns-section-block ns-b-purple-gradient">
                        <section>
                            <h3>Modifier le profil</h3>
                            <div class="d-flex flex-column gap-3 align-content-stretch">
                            <div class="ns-user-edit-field">
                                <span>Adresse E-mail :</span>
                                <ns-api-data field="email" class="ns-fs-6"></ns-api-data>
                                <button class="btn ns-btn-sm ns-tickle-pink-btn rounded-0" ns-profile-edit-type="${EditInfoModal.TYPE_EMAIL}">Modifier</button>
                            </div>
                            <div class="ns-user-edit-field">
                                <span>Nom d'utilisateur</span>
                                <ns-api-data field="username" class="ns-fs-6"></ns-api-data>
                                <button class="btn ns-btn-sm ns-tickle-pink-btn rounded-0" ns-profile-edit-type="${EditInfoModal.TYPE_USERNAME}">Modifier</button>
                            </div>
                            <div class="ns-user-edit-field">
                                <span>Date de naissance</span>
                                <ns-api-data field="birthday" class="ns-fs-6"></ns-api-data>
                                <button class="btn ns-btn-sm ns-tickle-pink-btn rounded-0" ns-profile-edit-type="${EditInfoModal.TYPE_BIRTHDAY}">Modifier</button>
                            </div>
                            <div class="ns-user-edit-field">
                                <span>Mot de passe</span>
                                <span class="ns-fs-6">*******</span>
                                <button class="btn ns-btn-sm ns-tickle-pink-btn rounded-0" ns-profile-edit-type="${EditInfoModal.TYPE_PASSWORD}">Modifier</button>
                            </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div class="ns-center pb-5 ns-text-white">
                    <div class="ns-section-block ns-b-purple-gradient">
                        <section>
                            <h3>Zone dangereuse</h3>
                            <p>Suppression du compte : Une fois ton compte supprimé, tu ne peux pas revenir en arrière !</p>
                            <div class ="ns-center">
                                <button class="ns-form-danger py-2 w-100 w-md-50 mx-auto mt-4" type="submit">Supprimer le compte</button>
                            </div>
                        </section>
                    </div>
                </div>`
        }
                html += `
                    </div>
                </div>
            </ns-api-data-block>
        </section>
        `
        return html;
    }

    constructor(app) {
        super(app);
    }

    getHTML(vars) {
        this.user = vars["user"]
        this.isSelf = this.user === "me" || this.user === this.app.user.id;
        return this.raw;
    }

    build(parent, vars) {
        super.build(parent, vars);
        this.dataBlock = _('#ns-profile-data');
        if (this.dataBlock.dataLoad) {
            this.fetchData();
        }
        this.dataBlock.addEventListener('dataLoad', this.fetchData.bind(this));
        _('button[ns-profile-edit-type]').forEach(node => {
            node.addEventListener('click', evt => {
                evt.preventDefault();
                window.APP.openModal(new EditInfoModal(window.APP, parseInt(evt.target.getAttribute('ns-profile-edit-type'))));
            })
        })
    }

    fetchData() {
        if (this.dataBlock.isError) {
            if (this.dataBlock.error.code > 0) {
                this.app.do404();
            } else {
                this.app.fatalError();
            }
        } else {
            const project =  _('#ns-user-upload');
            project.innerHTML = '';
            if (this.dataBlock.rawData.project.length > 0) {
                let inner = '';
                for (let v of this.dataBlock.rawData.project) {
                    inner += `<ns-project ns-id="${v.id}" ns-title="${v.title}" ns-picture="${v.picture}"></ns-project>`;
                }
                project.innerHTML = inner;
            } else {
                project.innerHTML = `Oh non c'est vide`;
            }

            const like =  _('#ns-user-like');
            like.innerHTML = '';
            if (this.dataBlock.rawData.like.length > 0) {
                let inner = '';
                for (let v of this.dataBlock.rawData.like) {
                    inner += `<ns-project ns-id="${v.project}/${v.id}" ns-title="${v.title}" ns-picture="${v.picture}"></ns-project>`;
                }
                like.innerHTML = inner;
            } else {
                like.innerHTML = `Oh non c'est vide`;
            }
        }
    }
}
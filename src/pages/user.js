class EditAvatarModal extends Component {

    data;
    previewContainer;
    settingsContainer;

    settings = {};

    get raw() {
        return `
         <form id="ns-modal-profile-avatar-form">
            <h3>Modifier la photo de profil</h3>
            <div class="ns-modal-profile-avatar-inside">
                <div id="ns-modal-profile-avatar-preview" class="ns-empty-placeholder"></div>
                <div id="ns-modal-profile-avatar-settings" class="ns-empty-placeholder"></div>
            </div>
            
            <div class="ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
                <button type="submit" class="ns-tickle-pink-bg">Modifier</button>
            </div>
        </form>
        `;
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_MODAL);
    }

    build(parent) {
        super.build(parent);
        this.previewContainer = _('#ns-modal-profile-avatar-preview');
        this.settingsContainer = _('#ns-modal-profile-avatar-settings');
        sendApiGetFetch('avatar-settings').then( data => {
            this.data = data;
            this.loadData();
            _('#ns-modal-profile-avatar-form').addEventListener('submit', this.send.bind(this));
        }).catch((r) => {
            window.APP.closeModal();
            window.APP.openInfoModal(TYPE_ERROR, 'Une erreur est survenue', 'Verifier vottre conexion internet et réssayer');
        })
    }

    loadData() {
        const imageContainer = create('div', null, this.previewContainer, 'ns-modal-profile-avatar-images');
        for (let key in this.data) {
            let type = this.data[key];
            this.settings[key] = {};
            this.settings[key].img = create('img', null, imageContainer);

            const btnGroup = create('div', null, this.settingsContainer, 'ns-modal-profile-avatar-btn-group');
            createPromise('span', null, btnGroup).then(e => e.innerText = type.display);
            const btns = create('div', null, btnGroup);
            createPromise('button', null, btns).then(e => {
                e.type = 'button';
                create('i', null, e, 'bi', 'bi-caret-left-fill');
                e.addEventListener('click', this.changeSettings.bind(this, key, false));
            })
            this.settings[key].label = create('span', null, btns);
            this.settings[key].value = type.nullable ? -1 : 0;
            createPromise('button', null, btns).then(e => {
                e.type = 'button';
                create('i', null, e, 'bi', 'bi-caret-right-fill');
                e.addEventListener('click', this.changeSettings.bind(this, key, true));
            })
        }
        this.updateDisplay();
    }

    changeSettings(name, right, event) {
        event.preventDefault();

        let current = this.settings[name].value;
        let max = this.data[name]['count'] - 1;
        let min = this.data[name]['nullable'] ? -1 : 0;

        let newValue = current + (right ? 1 : -1);
        if (newValue > max) newValue = min;
        else if (newValue < min) newValue = max;
        this.settings[name].value = newValue;
        console.log(this.settings);
        this.updateDisplay();
    }

    updateDisplay() {
        for (let key in this.settings) {
            this.settings[key].label.innerText = this.settings[key].value < 0 ? 'Aucun' : this.settings[key].value;
            const img = this.settings[key].img;
            const newUrl = this.settings[key].value < 0 ? '' : `/res/avatar/${key}/${this.settings[key].value}.png`;
            if (img.src !== newUrl) img.src = newUrl;
        }
    }

    send(e) {
        e.preventDefault();
        const fd = new FormData;
        for (let key in this.settings) {
            fd.set(key, this.settings[key].value);
        }
        loadingScreen(true);
        sendApiPostFetch('user/edit/avatar', fd).then(() => {
            window.APP.closeModal();
            window.APP.reload();
        }).catch((r) => {
            console.log(r);
            window.APP.closeModal();
            window.APP.openInfoModal(TYPE_ERROR, 'Une erreur est survenue', 'Verifier vottre conexion internet et réssayer');
        }).finally(() => loadingScreen(false));
    }

}

class EditInfoModal extends Component {

    static TYPE_EMAIL = 0;
    static TYPE_PASSWORD = 1;
    static TYPE_USERNAME = 2;
    static TYPE_BIRTHDAY = 3;
    static TYPE_DELETE = 4;

    static STRUCT = {
        [EditInfoModal.TYPE_EMAIL]: {name: 'email', api: 'user/edit/email', needConfirmation: true,  fields: [{name: 'email', display: 'E-mail', type: 'email'}]},
        [EditInfoModal.TYPE_PASSWORD]: {name: 'mot de passe', api: 'user/edit/password', needConfirmation: true,  fields: [
            {name: 'password', display: 'Mot de passe', type: 'password'},
            {name: 'password-v', display: 'Confirmation', type: 'password'}
            ]},
        [EditInfoModal.TYPE_USERNAME]: {name: 'nom d\'utilisateur', api: 'user/edit/username', needConfirmation: false,  fields: [{name: 'username', display: 'Nom d\'utilisateur', type: 'text'}]},
        [EditInfoModal.TYPE_BIRTHDAY]: {name: 'date de naissance', api: 'user/edit/birthday', needConfirmation: false,  fields: [{name: 'birthday', display: 'Date de naissance', type: 'date'}]},
        [EditInfoModal.TYPE_DELETE]: {name: 'Suppressions de votre compte', api: 'user/delete', needConfirmation: true,  fields: []},
    }

    c_type;
    error;

    get raw() {
        return `
         <form id="ns-modal-profile-form">
            <h3>${this.c_type === EditInfoModal.TYPE_DELETE ? '' : 'Modifier votre'} ${EditInfoModal.STRUCT[this.c_type].name}</h3>
            <div class="alert alert-danger" id="ns-modal-profile-error">
            
            </div>
            <div class="d-flex flex-column my-3 gap-3" id="ns-modal-profile-fields">
               
            </div>
            <div class="ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
                ${ this.c_type === EditInfoModal.TYPE_DELETE ?
                    '<button type="submit" class="bg-danger">Supprimer</button>' : 
                    '<button type="submit" class="ns-tickle-pink-bg">Modifier</button>'
                }
                
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
        input.required = true;
    }

    build(parent) {
        super.build(parent);
        const fields = _('#ns-modal-profile-fields');
        if (this.c_type === EditInfoModal.TYPE_DELETE) {
            let warn = create('p', null, fields, 'alert', 'alert-danger');
            warn.innerHTML = `Une fois ton compte supprimé, tu ne peux pas revenir en arrière !<br>
                                Nous supprimerons tes données perosnelle (email, date de naissance pseudo) <br> 
                                tous vos postes ne seront pas supprimés mais seront affiché comme publié par un utilisateur supprimé`
        }
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
                if(this.c_type === EditInfoModal.TYPE_DELETE)
                    this.app.openInfoModal(TYPE_WARN, EditInfoModal.STRUCT[this.c_type].name, `Un mail de vérification vous a été envoyé, une fois que vous vérifiez votre compte sera supprimé.`);
                else this.app.openInfoModal(TYPE_SUCCESS, `Modification de votre ${EditInfoModal.STRUCT[this.c_type].name}`, `Un mail de vérification vous a été envoyé, une fois verifier votre ${EditInfoModal.STRUCT[this.c_type].name} seras modifier.`);
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
                                <div class="p-2${this.isSelf ? ' ns-profile-avatar-edit' : ''}">
                                    <img src="/res/profile.webp" id="ns-profile-avatar" alt="profilePhoto" class="ns-avatar img-responsive">
                                    ${this.isSelf ? '<i class="bi bi-pencil"></i>' :''}
                                </div>
                                <div class="p-2">
                                    <h3><ns-api-data field="username"></ns-api-data></h3>
                                    <span><ns-api-data field="age"></ns-api-data> ans</span>
                                </div>
                            </div>
                            <div class="d-flex flex-column justify-content-end">
                                <div class="p-2">
                                    <button id="ns-profile-download" class="btn ns-btn-sm ns-tickle-pink-btn">Télécharger</button>
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
                                <button class="ns-form-danger py-2 w-100 w-md-50 mx-auto mt-4" ns-profile-edit-type="${EditInfoModal.TYPE_DELETE}">Supprimer le compte</button>
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
        let  download =_('#ns-profile-download');
        _('.ns-profile-avatar-edit').forEach(e => e.addEventListener('click', () => window.APP.openModal(new EditAvatarModal(window.APP))));
        if (this.isSelf || this.app.user.permissionLevel >= 200 ) {
            download.addEventListener('click', evt => {

                let auth = window.APP.user.authorization;
                let header = {
                    'Authorization': auth
                };

                if (auth === null) delete header.Authorization;
                fetch(new Request(`/api/v1/user/${this.user}?pdf=1`, {
                    method: "GET",
                    headers: new Headers(header)
                })).then(r => r.arrayBuffer()).then(data => {
                    let file = new Blob([data], {type: 'application/pdf'});
                    let fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }).catch(() => window.APP.createToast(TYPE_ERROR, 'Téléchargement pdf', 'Erreur serveur'))
            })
        } else download.parentElement.remove();

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
                inner += `<ns-a class="btn ns-tickle-pink-btn" href="/s/author:${this.user}" >Voir plus</ns-a>`
                project.innerHTML = inner;
            } else {
                project.innerHTML = `Oh non c'est vide`;
            }

            const like =  _('#ns-user-like');
            like.innerHTML = '';
            if (this.dataBlock.rawData.like.length > 0) {
                let inner = '';
                for (let v of this.dataBlock.rawData.like) {
                    inner += `<ns-project ns-id="${v.project}/${v.volume}" ns-title="${v.title}" ns-picture="${v.picture}"></ns-project>`;
                }
                inner += `<ns-a class="btn ns-tickle-pink-btn" href="/s/likeby:${this.user}" >Voir plus</ns-a>`
                like.innerHTML = inner;
            } else {
                like.innerHTML = `Oh non c'est vide`;
            }
            console.log(this.dataBlock.rawData);
            _('#ns-profile-avatar').src = this.dataBlock.rawData.avatar ? image_id_to_path(this.dataBlock.rawData.avatar) : '/res/profile.webp';
        }
    }
}
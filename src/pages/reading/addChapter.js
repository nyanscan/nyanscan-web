export default class extends Pages {

    id;
    isSending = false;

    block;
    previewCanvas;
    projectPreviewCanvas;
    pictureInput;
    projectPictureInput;
    errorBlock;
    previewCTX;
    projectPreviewCTX;
    previewImage;
    projectPreviewImage;
    addForm;

    get raw() {
        return `
        <section>
            <div id="ns-p-edit-err" class="alert alert-danger" style="display: none">
            
            </div>
            <ns-api-data-block id="ns-p-edit-block" href="project/${this.id}">
            <h1 class="ns-text-red ns-fs-1 my-3 ns-container bg-none" style="filter: none !important;">Edtition de <ns-api-data field="title"></ns-api-data></h1>
            <form id="ns-p-edit-form">
                <input type="hidden" hidden="hidden" name="project" value="${this.id}">
                <div class="ns-container">
                    <h2 class="ns-fs-2 ns-text-red mb-4">Modifier le projet</h2>
                    <div class="ns-pr-info">
                        <div class="ns-project-picture-edit">
                               <canvas id="ns-p-old-edit-preview" width="296" height="420"></canvas>
                               <label>
                                    <i class="b bi-plus-circle"></i>
                                    <input id="ns-p-old-edit-picture" type="file" name="picture" accept="image/png,image/jpeg">
                                </label>
                        </div>                    
                        <div class="ns-pr-desc">
                            <h1 class="ns-fs-1">
                                <input type="text" name="title" value="$title$" class="ns-data-field-var ns-pr-title">
                            </h1>
                            <textarea class="ns-fs-5" id="ns-pr-desc-edit" rows="5" name="description"></textarea>
                            <div class="ns-form-group mt-3">
                                <select id="ns-publish-direction" name="direction" class="form-select">
                                    <option value="1">De droite à gauche (japonais)</option>
                                    <option value="2">De gauche à droite (Classique)</option>
                                </select>
                            <div class="form-text">Dans quel sens les pages vont être tournées</div>
                            </div>
                            <button type="submit" class="btn ns-tickle-pink-btn ns-form-pink"> Enregistrer la modification</button>
                        </div>
                    </div>
                </div>
            </form>
            <form id="ns-p-edit-add" class="ns-container ns-categ-topic text-black">
                <h2 class="ns-fs-2 ns-text-red mb-4">Ajouter un tome</h2>
                <input type="hidden" hidden="hidden" name="project" value="${this.id}">
                <div class="d-flex flex-row justify-content-center gap-5 flex-wrap">
                    <div>
                        <div class="ns-project-picture-edit">
                           <canvas id="ns-p-edit-preview" width="296" height="420"></canvas>
                           <label>
                                <i class="b bi-plus-circle"></i>
                                <input id="ns-p-edit-picture" type="file" name="picture" accept="image/png,image/jpeg">
                            </label>
                        </div>   
                    </div>
                    <div>
                        <div>
                            <u>Vignette de la page du tome</u>
                            <div>
                                Ration: 8/6 <br>
                                Format : JPG ou GIF<br>
                                Poids : 500Ko max.
                            </div>
                            <p style="max-width: 550px">
                                Celle-ci représentera le manga sur Nyanscan, c'est ce que les lecteurs verront en premier avant de le lire !
                            </p>
                        </div>
                        <div>
                            <div class="ns-form-group">
                                <label for="ns-p-edit-title" class="form-label">Titre</label>
                                <input id="ns-p-edit-title" name="title" type="text" class="form-control" required>
                                <div class="form-text">Titre du tome. Ne pas mettre le numéro !</div>
                            </div>
                            <div class="ns-form-group">
                                <label for="ns-p-edit-volume" class="form-label">Numéro de tome</label>
                                <input id="ns-p-edit-volume" name="volume" type="number" min="1" value="1" step="1">
                            </div>
                            <div class="ns-form-group">
                                <label for="ns-p-pdf-volume" class="form-label">Fichier PDF du tome</label>
                                <input type="file" name="pdf" id="ns-g-pdf-volume" accept="application/pdf,application/vnd.ms-excel">
                                <div class="form-text">Fichier PDF du tome avec les pages dans l'ordre de lecture.</div>
                            </div>
                            <button class="btn ns-tickle-pink-btn ns-form-pink w-100 mx-auto mt-4" type="submit">Valider</button>
                        </div>
                    </div>
                </div>
            </form>
            </ns-api-data-block>
        </section>
        `;
    }

    build(parent, vars) {
        window.URL = window.URL || window.webkitURL;
        this.id = vars["project"];
        if (!this.id) {
            this.app.do404();
        }
        super.build(parent, vars);
        this.addForm = _('#ns-p-edit-add');
        this.editForm = _('#ns-p-edit-form');
        this.block = _('#ns-p-edit-block');
        this.previewCanvas = _('#ns-p-edit-preview');
        this.projectPreviewCanvas = _('#ns-p-old-edit-preview');
        this.previewCTX = this.previewCanvas.getContext('2d');
        this.projectPreviewCTX = this.projectPreviewCanvas.getContext('2d');
        this.pictureInput = _('#ns-p-edit-picture');
        this.projectPictureInput = _('#ns-p-old-edit-picture');
        this.errorBlock = _('#ns-p-edit-err');
        if (this.block.dataLoad) {
            this.checkAPIErr();
        }
        this.pictureInput.addEventListener('change', this.imagePreviewChange.bind(this, true));
        this.projectPictureInput.addEventListener('change', this.imagePreviewChange.bind(this, false));
        this.previewImage = new Image();
        this.projectPreviewImage = new Image();
        this.previewImage.onload = (function () {
            this.previewCTX.drawImage(this.previewImage, 0, 0, 296, 420);
        }).bind(this);
        this.projectPreviewImage.onload = (function () {
            this.projectPreviewCTX.drawImage(this.projectPreviewImage, 0, 0, 296, 420);
        }).bind(this);
        this.addForm.addEventListener('submit', this.send.bind(this));
        this.editForm.addEventListener('submit', this.sendEdit.bind(this));
        this.block.addEventListener('dataLoad', this.checkAPIErr.bind(this));
    }

    initPreviewEdit() {
        console.log(this.block.rawData.description);
        this.projectPreviewImage.src = image_id_to_path(this.block.rawData.picture);
        _('#ns-pr-desc-edit').value = this.block.rawData.description;
        if (this.block.rawData.reading_direction === '1')
            _('#ns-publish-direction').firstElementChild.selected = true;
        else _('#ns-publish-direction').lastElementChild.selected = true;
    }

    checkAPIErr() {
        if (this.block.isError) {
            this.app.do404();
        } else {
            if (this.block.rawData['author'] !== this.app.user.id && this.app.user.permissionLevel < 200) this.app.do404();
            this.initPreviewEdit();
        }
    }

    imagePreviewChange(isNew=true, event) {
        if(this.pictureInput.files) {
            const file = event.target.files[0];
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                if (file.size <= 1_000_000) {
                    (isNew ? this.previewImage: this.projectPreviewImage).src = window.URL.createObjectURL(file);
                } else  {
                    event.target.value = '';
                    this.app.openInfoModal(TYPE_ERROR, 'Upload image trop lourde', 'L\'image a un poids limite de 1Mo !');
                    // this.app.openInfoModal(TYPE_ERROR, 'Upload image trop lourde', 'L\'image a un poids limite de 1Mo !');
                }
            } else {
                event.target.value = '';
                this.app.openInfoModal(TYPE_ERROR, 'Upload image invalide', 'L\'image dois être en PNG ou JPG !');
            }
        } else {
            (isNew ? this.previewImage: this.projectPreviewImage).src = '';
        }
    }

    send(event) {
        event.preventDefault();
        if (this.isSending) return;
        this.isSending = true;
        const fd = new FormData(event.target);
        loadingScreen(true);
        sendApiPostRequest('project/volume', fd, this.sendCallback.bind(this, fd.get('title')), this.sendProgressCallback.bind(this));
    }

    sendEdit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        console.log(event.target);
        loadingScreen(true);
        sendApiPostFetch('project/edit', fd).then(() =>
            this.app.createToast(TYPE_SUCCESS, 'Modification', 'la modification a bien était prise en compte.', false, 60)
        ).catch(r => {
            this.app.openInfoModal(TYPE_ERROR, 'Erreur formulaire', r.reason.map(e => `<p>${e}</p>`), true);
        }).finally(() => loadingScreen(false));
    }

    sendProgressCallback(event) {
        const percent = Math.round( (event.loaded / event.total) * 100);
        this.app.loading.progress = percent;
        if (percent >= 100)
            this.app.loading.textHtml = `Upload en cours... Vous pouvez aller à la page <ns-a class="ns-tickle-pink-btn ns-btn-sm">d'accueil</ns-a> le temps que le processus se termine ou patientez : Vous serez automatiquement redirigé à la fin.`
    }

    sendCallback(title, event) {
        this.isSending = false;
        loadingScreen(false);
        const $repStatus = checkApiResStatus(event);
        if ($repStatus === API_REP_OK) {
            this.app.createToast(TYPE_SUCCESS, 'Upload tome', 'L\'upload du tome ' + title + ' est fini !');
            this.app.changePage('/p/' + this.id);
        } else if ($repStatus === API_REP_BAD) {
            const err = getAPIErrorReason(event);
            this.app.openInfoModal(TYPE_ERROR, 'Erreur formulaire', err.map(e => `<p>${e}</p>`), true);

        } else {
            this.app.openInfoModal(TYPE_ERROR, 'Erreur formulaire', 'Erreur d\'upload verifier votre connexion');
        }
    }

    constructor(app) {
        super(app);
    }
}
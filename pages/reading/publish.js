export default class extends Pages {

    title = 'Créer un projet | NyanScan'

    publishForm;
    previewCanvas;
    previewCTX;
    previewImage;
    pictureInput;
    pictureURL;
    errorBlock;

    get raw() {
        return `
<section>
    <div id="ns-publish-err" class="alert alert-danger" style="display: none">
        
    </div>
    <div class="ns-forum-center ms-3">
        <div class="p-4 justify-content-start">
            <h2>Publier un projet</h2>
        </div>
    </div>
    
    <div class="ns-center d-flex">
        <hr class="ns-line">
    </div>
    <div class="ns-center">
        <form id="ns-publish-form" class="ns-categ-topic my-5">
        <div>
            <div>
                <u>Vignette du manga</u>
                <div>
                    Ratio: 8/6 <br>
                    Format : jpg ou gif<br>
                    Poids : 500Ko max.
                </div>
                <p>
                    Celle-ci représentera votre projet sur Nyanscan. C'est ce que les lecteurs verront en premier avant de le découvrir !
                </p>
            </div>
            <div>
                <div  style="width: 180px;height: 240px;overflow: hidden" class="ns-picture-preview">
                       <canvas id="ns-publish-preview" width="180" height="240"></canvas>
                </div>
            </div>
            <div class="my-3">
                <input id="ns-publish-picture" type="file" name="picture" accept="image/png,image/jpeg">
            </div>
        </div>
        <div>
            <div class="ns-form-group">
                <label for="ns-publish-title" class="form-label">Titre</label>
                <input id="ns-publish-title" name="title" type="text" class="form-control" required>
                <div class="form-text">Titre global de l'ouvrage. Merci de ne pas mettre le numéro du tome ou du chapitre !</div>
            </div>
            <div class="ns-form-group">
                <label for="ns-publish-format" class="form-label">Format de publication</label>
                <select id="ns-publish-format" name="format" class="form-select">
                    <option value="1" selected>Série</option>
                    <option value="2">One-shot</option>
                </select>
                <div class="form-text">Le format de publication pourra être changé par la suite.</div>
            </div>
            <div class="ns-form-group">
                <label for="ns-publish-direction" class="form-label">Sens de lecture</label>
                <select id="ns-publish-direction" name="direction" class="form-select">
                    <option value="1" selected>De droite à gauche (japonais)</option>
                    <option value="2">De gauche à droite (Classique)</option>
                </select>
                <div class="form-text">Dans quel sens les pages vont être tournées</div>
            </div>
            <div class="ns-form-group">
                <label for="ns-publish-title" class="form-label">Description</label>
                <textarea id="ns-publish-description" name="description" class="form-control" rows="4" maxlength="2000" required></textarea>
                <div class="form-text">Synopsis de l'œuvre et/ou informations la concernant. (max 2000 char)</div>
            </div>
        </div>
        <div>
            <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit"> Valider </button>
        </div>
    </form>
    </div>
    
</section>
`;
    }

    getHTML(vars) {
        return super.getHTML(vars);
    }

    build(parent, vars) {
        super.build(parent, vars);
        this.publishForm = _('#ns-publish-form');
        this.previewCanvas = _('#ns-publish-preview');
        this.previewCTX = this.previewCanvas.getContext('2d');
        this.pictureInput = _('#ns-publish-picture');
        this.errorBlock = _('#ns-publish-err');
        this.pictureInput.addEventListener('change', this.imagePreviewChange.bind(this));
        this.previewImage = new Image();

        this.previewImage.onload = (function () {
            this.previewCTX.drawImage(this.previewImage, 0, 0, 180, 240);
        }).bind(this);

        this.publishForm.addEventListener('submit', this.send.bind(this));

    }

    imagePreviewChange(event) {
        if(this.pictureInput.files) {
            const file = this.pictureInput.files[0];
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                console.log(file.size);
                if (file.size <= 1e6) {
                    window.URL = window.URL || window.webkitURL;
                    this.pictureURL = window.URL.createObjectURL(file);
                    this.previewImage.src = this.pictureURL;
                } else  {
                    // todo warn
                    this.pictureInput.value = '';
                    console.warn('to heavy');
                }
            } else {
                //todo warn
                this.pictureInput.value = '';
                console.warn('invalid format');
            }
        } else this.previewImage.src = '';
    }

    send(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        sendApiPostRequest('project/create', fd, this.sendCallback.bind(this));
    }

    sendCallback(event) {
        const $repStatus = checkApiResStatus(event);
        if ($repStatus === API_REP_OK) {
            // todo: toast
            // todo: change to list
            this.app.changePage('/');
        } else if ($repStatus === API_REP_BAD) {
            const err = getAPIErrorReason(event);
            this.errorBlock.innerHTML = '';
            this.errorBlock.style.display = 'block';
            for (let errElement of err) {
                createPromise('p', null, this.errorBlock).then(e => e.innerText = errElement);
            }
        } else {
            //todo warn
            console.warn('error upload');
        }
    }

    constructor(app) {
        super(app);
    }
}
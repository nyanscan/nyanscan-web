export default class extends Pages {

    id;

    block;
    previewCanvas;
    pictureInput;
    errorBlock;
    previewCTX;
    previewImage;
    peditForm;

    get raw() {
        return `
<section>
    <div id="ns-p-edit-err" class="alert alert-danger" style="display: none">
        
    </div>
    <ns-api-data-block id="ns-p-edit-block" href="project/${this.id}">
    <h2>Edtition de <ns-api-data field="title"></ns-api-data></h2>
    <form id="ns-p-edit-form">
        <input type="hidden" hidden="hidden" name="project" value="${this.id}">
        <div>
            <div>
                <div  style="width: 180px;height: 240px;overflow: hidden">
                       <canvas id="ns-p-edit-preview" width="180" height="240"></canvas>
                </div>
            </div>
            <div>
                <u>Vignette de la page du tome</u>
                <div>
                    Ration: 8/6 <br>
                    Format : jpg ou gif<br>
                    Poids : 500Ko max.
                </div>
                <p>
                    Celle-ci représentera le manga sur Nyanscan, c'est ce que les lecteurs verront en premier avant de le lire !
                </p>
                <input id="ns-p-edit-picture" type="file" name="picture" accept="image/png,image/jpeg">
            </div>volume
        </div>
        <div>
            <div class="ns-form-group">
                <label for="ns-p-edit-title" class="form-label">Titre</label>
                <input id="ns-p-edit-title" name="title" type="text" class="form-control" required>
                <div class="form-text">Titre du tome ne pas mettre le numéro !</div>
            </div>
            <div class="ns-form-group">
                <label for="ns-p-edit-volume" class="form-label">Numéroe de tome</label>
                <input id="ns-p-edit-volume" name="volume" type="number" min="1" value="1" step="1">
            </div>
<!--            <div class="ns-form-group">-->
<!--                <label for="ns-p-edit-volume" class="form-label">Nombre de page</label>-->
<!--                <input id="ns-p-edit-volume" name="page_count" type="number" min="1" value="1" step="1">-->
<!--            </div>-->
            <div class="ns-form-group">
                <label for="ns-p-pdf-volume" class="form-label">Fichier pdf du tome</label>
                <input type="file" name="pdf" id="ns-g-pdf-volume" accept="application/pdf,application/vnd.ms-excel">
                <div class="form-text">Fichier PDF du tome avec les pages dans l'ordre de lecture</div>
            </div>
        </div>
        <div>
            <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit"> Valider </button>
        </div>
    </form>
    </ns-api-data-block>
</section>
        `;
    }

    build(parent, vars) {
        this.id = vars["project"];
        if (!this.id) this.app.do404();
        super.build(parent, vars);
        this.peditForm = _('#ns-p-edit-form');
        this.block = _('#ns-p-edit-block');
        this.previewCanvas = _('#ns-p-edit-preview');
        this.previewCTX = this.previewCanvas.getContext('2d');
        this.pictureInput = _('#ns-p-edit-picture');
        this.errorBlock = _('#ns-p-edit-err');
        if (this.block.dataLoad) this.checkAPIErr();
        this.block.addEventListener('dataLoad', this.checkAPIErr.bind(this));

        this.pictureInput.addEventListener('change', this.imagePreviewChange.bind(this));
        this.previewImage = new Image();
        this.previewImage.onload = (function () {
            this.previewCTX.drawImage(this.previewImage, 0, 0, 180, 240);
        }).bind(this);

        this.peditForm.addEventListener('submit', this.send.bind(this));

    }

    checkAPIErr() {
        if (this.block.isError) this.app.do404();
    }

    imagePreviewChange(event) {
        console.log(event);
        if(this.pictureInput.files) {
            const file = this.pictureInput.files[0];
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                if (file.size <= 500_000) {
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
        sendApiPostRequest('project/volume', fd, this.sendCallback.bind(this));
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
export default class extends Pages {

    publishForm;
    previewCanvas;
    previewCTX;
    previewImage;
    pictureInput;
    pictureURL;

    get raw() {
        return `
<section>
    <form id="ns-publish-form">
        <div>
            <div>
                <div  style="width: 180px;height: 240px;overflow: hidden">
                       <canvas id="ns-publish-preview" width="180" height="240"></canvas>
                </div>
            </div>
            <div>
                <u>Vignette de la page du manga</u>
                <div>
                    Ration: 8/6 <br>
                    Format : jpg ou gif<br>
                    Poids : 500Ko max.
                </div>
                <p>
                    Celle-ci représentera votre projet sur Nyanscan, c'est ce que les lecteurs verront en premier avant de le découvrir !
                </p>
                <input id="ns-publish-picture" type="file" accept="image/png,image/jpeg">
            </div>
        </div>
        <div>
            <div class="ns-form-group">
                <label for="ns-publish-title" class="form-label">Titre</label>
                <input id="ns-publish-title" type="text" class="form-control" required>
                <div class="form-text">Titre global de l'ouvrage, merci de ne pas mettre de numéro de tome ou de chapitre</div>
            </div>
            <div class="ns-form-group">
                <label for="ns-publish-format" class="form-label">Format de publicaton</label>
                <select id="ns-publish-format" class="form-select">
                    <option value="1" selected>Série</option>
                    <option value="2">Oneshot</option>
                </select>
                <div class="form-text">Le format de publication pourra être changé par la suite.</div>
            </div>
            <div class="ns-form-group">
                <label for="ns-publish-direction" class="form-label">Sens de lecture</label>
                <select id="ns-publish-direction" class="form-select">
                    <option value="1" selected>De droite à gauche (japonais)</option>
                    <option value="2">De gauche à droite (Classqique)</option>
                </select>
                <div class="form-text">Dans quel sens les pages vont être tournées</div>
            </div>
            <div class="ns-form-group">
                <label for="ns-publish-title" class="form-label">Descripton</label>
                <textarea id="ns-publish-description" class="form-control" rows="4" maxlength="2000" required></textarea>
                <div class="form-text">Synopsis de l'oeuvre et/ou informations la concernant. (max 2000 char)</div>
            </div>
        </div>
        <div>
            <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit"> Valider </button>
        </div>
    </form>
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
        this.pictureInput.addEventListener('change', this.imagePreviewChange.bind(this));
        this.previewImage = new Image();

        this.previewImage.onload = (function () {
            this.previewCTX.drawImage(this.previewImage, 0, 0, 180, 240);
        }).bind(this);

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
                    console.warn('to heavy');
                }
            } else {
                //todo warn
                console.warn('invalid format');
            }
        } else this.previewDiv.innerHTML = '';
    }

    constructor(app) {
        super(app);
    }

    thi

}
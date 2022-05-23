export default class extends Pages {

    id;

    block;

    get raw() {
        return `
<section>
    <div id="ns-publish-err" class="alert alert-danger" style="display: none">
        
    </div>
    <ns-api-data-block id="ns-p-edit-block" href="project/${this.id}">
    <h2>Edtition de <ns-api-data field="title"></ns-api-data></h2>
    <form id="ns-p-edit-form">
        <div>
            <div>
                <div  style="width: 180px;height: 240px;overflow: hidden">
                       <canvas id="ns-publish-preview" width="180" height="240"></canvas>
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
                <input id="ns-publish-picture" type="file" name="picture" accept="image/png,image/jpeg">
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
                <input id="ns-p-edit-volume" name="volume" type="number" min="1" value="-1" step="1">
            </div>
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
        this.block = _('#ns-p-edit-block');
        if (this.block.dataLoad) this.checkAPIErr();
        this.block.addEventListener('dataLoad', this.checkAPIErr.bind(this));
    }

    checkAPIErr() {
        if (this.block.isError) this.app.do404();
    }


    constructor(app) {
        super(app);
    }

}
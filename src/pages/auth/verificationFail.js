export default class extends Pages {
    title="Verification invalide | NyanScan"
    get raw() {
        return `
        <div class="ns-success-css mb-5">
            <div class="ns-center">
                <div class="ns-scan-failed align-items-center">
                    <p class="ns-fs-4 m-0 text-center">Lien de vérification invalide ! Essayez de vous <ns-a href="/auth" class="btn ns-btn-sm ns-tickle-pink-btn">reconnecter</ns-a> pour recevoir un nouveau mail de vérification.</p>
                </div>
            </div>
        </div>
        <div class="mx-3 pb-5">
            <img src="../../res/failed.png" class="img-fluid mx-auto d-block" width="400" alt="image fail">
        </div>
        `;
    }

    constructor(app) {
        super(app);
    }
}
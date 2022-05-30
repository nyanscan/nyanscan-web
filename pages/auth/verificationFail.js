export default class extends Pages {
    title="Verification refusé | NyanScan"
    get raw() {
        return `
    <div class="ns-success-css mb-5">
        <div class="ns-center">
            <div class="ns-scan-failed align-items-center">
                <p class="ns-font-size-success"> Lien de vérification invalide ! Essayez de vous <ns-a href="/auth">connecter</ns-a> pour recevoir un nouveau mail de vérification.</p>
            </div>
        </div>
    </div>
    <div class="mx-3 pb-5"> <img src="../../res/failed.png" class="img-fluid mx-auto d-block" width="400"></div>
        `;
    }

    constructor(app) {
        super(app);
    }

}
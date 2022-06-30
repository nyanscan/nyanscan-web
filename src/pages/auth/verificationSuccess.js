export default class extends Pages {
    title="Verification réussie | NyanScan"
    get raw() {
        return `
        <div class="ns-success-css mb-5">
            <div class="ns-center">
                <div class="ns-scan-success align-items-center">
                    <p class="ns-fs-4 text-center m-0">Votre compte a bien été vérifié. Vous pouvez vous connecter maintenant en cliquant <ns-a href="/auth/login" class="btn ns-btn-sm ns-tickle-pink-btn">ici</ns-a></p>
                </div>
            </div>
        </div>
        <div class="mx-3 pb-5">
            <img src="../../res/success.png" class="img-fluid mx-auto d-block" width="400" alt="image success">
        </div>
        `;
    }

    constructor(app) {
        super(app);
    }
}
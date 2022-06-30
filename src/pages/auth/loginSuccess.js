export default class extends Pages {

    mail_token;
    user_id;
    btn;
    click = false;

    get raw() {
        return `
            <div class="ns-success-css mb-5">
            <div class="ns-center">
                <div class="ns-scan-wait align-items-center">
                    <p class="ns-fs-4 m-0 text-center">
                        Votre compte a bien été créé. Un email de vérification a été envoyé ! <br>
                        Pas de mail reçu ? Cliquez <button id="ns-resend-mail" type="button" class="btn ns-btn-sm ns-tickle-pink-btn">ici</button> pour en recevoir un nouveau !
                    </p>
                </div>
            </div>
        </div>
        <div class="mx-3 pb-5">
            <img src="../../res/success.png" class="img-fluid mx-auto d-block" width="400" alt="image fail">
        </div>
        `;
    }

    build(parent, vars) {
        this.mail_token = this.app.session["mail_token"];
        this.user_id = this.app.session["user_id"];
        delete this.app.session["mail_token"];
        delete this.app.session["user_id"];
        if (this.mail_token === undefined || this.user_id === undefined) {
            this.app.changePage('/');
            return;
        }
        super.build(parent, vars);
        this.btn = _('#ns-resend-mail');
        this.btn.addEventListener('click', this.resend.bind(this));
    }

    resend() {
        if (!this.click) {
            this.click = true;
            this.btn.disabled = true;
            sendApiGetFetch(`auth/verification?t=${this.mail_token}&user=${this.user_id}`).catch(console.error);
            // todo: toast
        }
    }

    constructor(app) {
        super(app);
    }
}
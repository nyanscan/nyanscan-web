export default class extends Pages {

    mail_token;
    user_id;
    btn;
    click = false;

    get raw() {
        return `
            <div>
                Votre compte a bien été créé. Un email de vérification a été envoyé ! <br>
                Pas de mail reçu ? Cliquez <button id="ns-resend-mail" type="button" class="btn btn-primary">ici</button> pour en recevoir un nouveau !
            </div>
        `
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
            sendApiGetRequest(`auth/verification?t=${this.mail_token}&user=${this.user_id}`);
            // todo: toast
        }
    }

    constructor(app) {
        super(app);
    }
}
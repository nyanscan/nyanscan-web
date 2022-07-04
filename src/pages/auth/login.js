class ForgetPassword extends Component {

    get raw() {
        return `
         <form id="ns-forget-password-form">
            <h3>Mot de passe oublié</h3>
            <div class="alert alert-danger" id="ns-modal-profile-error">
            
            </div>
            <div class="d-flex flex-column my-3 gap-3" id="ns-modal-profile-fields">
               <div>
                    <label for="ns-forget-password-email" class="form-label">E-MAIL</label> 
                    <input id="ns-forget-password-email" type="email" name="email" class="form-control" required>
               </div>
               <div>
                    <label for="ns-forget-password-password" class="form-label">Mot de passe</label> 
                    <input id="ns-forget-password-password" type="password" name="password" class="form-control" required>
               </div>
               <div>
                    <label for="ns-forget-password-password-v" class="form-label">Confirmation</label>
                    <input id="ns-forget-password-password-v" type="password" name="password-v" class="form-control" required>
               </div>
            </div>
            <div class="ns-modal-btn-container">
                <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>   
                <button type="submit" class="ns-tickle-pink-bg">Valider</button> 
            </div>
        </form>
        `;
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_MODAL);
    }

    build(parent) {
        super.build(parent);

        this.error = _('#ns-modal-profile-error');
        this.error.style.display = 'none';
        _('#ns-forget-password-form').addEventListener('submit', this.submit.bind(this));
    }

    submit(e) {
        e.preventDefault();
        loadingScreen(true);
        sendApiPostFetch('user/forget-password', new FormData(e.target)).then(() => {
            this.app.openInfoModal(TYPE_SUCCESS, `Mot de passe oublié`, `Un mail de vérification vous a été envoyé;`);
        }).catch(r => {
                e.target.reset();
                this.error.style = '';
                if (r.code > 0) {
                    this.error.innerText = r.reason;
                } else this.error.innerText = 'Une erreur est survenue verifier votre connexion.'
            }
        ).finally(() => loadingScreen(false));
    }

}

export default class extends Pages {

    isSending;

    get raw() {
        return `
        <section>
            <div class="ns-f-bg ns-f-bg-random">
            
            </div>
            <div class="container min-vh-100">
                <div class="row min-vh-100">
                    <div id="login" class="ns-theme-bg ns-theme-text rounded my-5 align-self-center col-10 offset-1 col-md-6 offset-md-3">
                        <div class="container pt-5 pb-3 d-flex flex-column align-items-center justify-content-around">
                            <div class="row pb-3">
                                <ns-a href="/"><img src="/res/icons/512.png" alt="nyanscan logo" class="ns-logo-auth"></ns-a>
                            </div>
                            <div class="row">
                                <h2>Se connecter</h2>
                            </div>
                            <div id="ns-log-error" class='row rounded mt-2 ns-b-azalea ns-text-red' style="display: none">
                            
                            </div>
                            <div>
                                <form id="ns-log-form" method="post">
                                    <label for="email">Adresse E-mail :</label>
                                    <input id="email" class="form-control ns-form-pink" type="email" required="required">
                                    <label for="mdp">Mot de passe :</label>
                                    <input id="mdp" class="form-control ns-form-pink" type="password" required="required">
                                    <button id="ns-forget-password" type="button" class="btn ns-btn-sm ns-tickle-pink-btn">Mot de passe oublié</button>
                                    <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit">Se connecter</button>
                                </form>
                            </div>
                            <div class="row"><p>Nouveau sur NyanScan ? <ns-a href="/auth/register" class="btn ns-btn-sm ns-tickle-pink-btn">S'inscrire</ns-a></p></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `
    }

    constructor(app) {
        super(app, false, false, false);
        this.isSending = false;
    }

    build(parent, vars) {
        super.build(parent, vars);
        _('#ns-log-form').addEventListener('submit', this.sendLogin.bind(this));
        loadRandomBackGround();
        _('#ns-forget-password').addEventListener('click', evt => {
            evt.preventDefault();
            window.APP.openModal(new ForgetPassword(window.APP));
        })
    }

    sendLogin(ev) {
        ev.preventDefault();
        if (!this.isSending) {
            this.isSending = true;
            // clear mdp
            const fd = new FormData();
            fd.append('user', _('#email').value);
            fd.append('password', _('#mdp').value);

            _("#mdp").value = '';
            sendApiPostFetch('auth/login', fd).then(data => {
                if (data["invalid"] !== undefined) {
                    this.app.session["mail_token"] = data["mail_token"];
                    this.app.session["user_id"] = data["user_id"];
                    this.app.changePage('/auth/wait-verification');
                } else {
                    this.app.user.setAuthorization(data['id'], data['token']);
                    this.app.user.log();
                    this.app.changePage('/');
                }
            }).catch(r => {
                const error =  _('#ns-log-error');
                error.style.display = 'inherit';
                if (r.code > 0) {
                    this.isSending = false;
                    error.innerText = r.reason;
                } else {
                    error.innerText = 'Une erreur de connexion est survenue';
                }
            })
        }
    }
}
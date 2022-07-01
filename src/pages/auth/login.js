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
                                <ns-a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo-auth"></ns-a>
                            </div>
                            <div class="row">
                                <h2>Se connecter</h2>
                            </div>
                            <div id="ns-log-error" class='row rounded mt-2 ns-b-azalea ns-text-red' style="display: none">
                            
                            </div>
                            <div class="<?php echo  $d_class ?>">
                                <form id="ns-log-form" method="post">
                                    <label for="email">Adresse E-mail :</label>
                                    <input id="email" class="form-control ns-form-pink" type="email" required="required">
                                    <label for="mdp">Mot de passe :</label>
                                    <input id="mdp" class="form-control ns-form-pink" type="password" required="required">
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
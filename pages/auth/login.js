export default class extends Pages {

    isSending;

    get raw() {
return `
<section>
    <div class="ns-f-bg ns-f-bg-auth"></div>
    <div class="container min-vh-100">
        <div class="row min-vh-100">
            <div id="login" class="ns-theme-bg ns-theme-text rounded my-5 align-self-center col-10 offset-1 col-md-6 offset-md-3">
                <div class="container pt-5 pb-3 d-flex flex-column align-items-center justify-content-around">
                    <div class="row pb-3">
                        <ns-a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo-auth"></ns-a>
                    </div>
                    <div class="row"><h2>Se connecter</h2></div>
                    <div id="ns-log-error" class='row rounded mt-2 ns-b-azalea ns-text-red' style="display: none">
                        
                    </div>
                    <div class="<?php echo  $d_class ?>">
                        <form id="ns-log-form" method="post">
                            <label for="email"> Adresse e-mail :</label>
                            <input id="email" class="form-control ns-form-pink" type="email" required="required">
                            <label for="mdp">Mot De Passe :</label>
                            <input id="mdp" class="form-control ns-form-pink" type="password"required="required">
                            <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit"> Se connecter</button>
                        </form>
                    </div>
                    <div class="row"><p>Nouveau sur NyanScan ? <ns-a href="/auth/register">S'inscrire</ns-a></p></div>
                </div>
            </div>
        </div>
    </div>
</section>`
    }

    constructor(app) {
        super(app, false, false, false);
        this.isSending = false;
    }

    build(parent, vars) {
        super.build(parent, vars);
        _('#ns-log-form').addEventListener('submit', this.sendLogin.bind(this));
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
            sendApiPostRequest('auth/login', fd, this.loginResult.bind(this));
        }
    }

    loginResult(event) {

        const repType = checkApiResStatus(event);
        if (repType === API_REP_OK) {
            this.app.user.log();
            this.app.changePage('/');
        }
        else {
            this.isSending = false;
            const error =  _('#ns-log-error');
            error.style.display = 'inherit';
            if (repType === API_REP_BAD) {
                error.innerText = getAPIErrorReason(event);
            } else error.innerText = 'Une erreur de connexion est survenue';
        }
    }

}
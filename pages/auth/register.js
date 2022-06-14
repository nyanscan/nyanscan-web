export default class extends Pages {

    isSending;
    captcha;

    get raw() {
        return `
        <section id="register">
            <div class="ns-f-bg ns-f-bg-auth">
            
            </div>
            <div class="container min-vh-100">
                <div class="row min-vh-100">
                    <div id="register" class="ns-theme-bg ns-theme-text rounded my-5 align-self-center col-10 offset-1 col-md-8 offset-md-2">
                        <div class="container pt-5 pb-3 d-flex flex-column align-items-center justify-content-around">
                            <div class="row pb-3">
                                <ns-a href="/"><img src="/res/logo-ns.png" alt="nyanscan logo" class="ns-logo-auth"></ns-a>
                            </div>
                            <div class="row">
                                <h2>Créer un compte</h2>
                            </div>
                            <div id="ns-log-error" class='row rounded mt-2 ns-b-azalea ns-text-red'>
                            
                            </div>
                            <div class="<?php echo  $d_class ?>">
                                <form id="ns-re-form" class="ns-f-wrap">
                                    <div class="ns-f-w-group">
                                        <label for="email">Adresse E-mail :</label>
                                        <input id="email" class="form-control ns-form-pink" type="email" name="email" required="required" ${this.app.session['register_email'] ? 'value=' + arrayPop(this.app.session, 'register_email') : ''}>
                                    </div>
                                    <div class="ns-f-w-group">
                                        <label for="username">Pseudo :</label>
                                        <input id="username" class="form-control ns-form-pink" type="text" name="username" required="required">
                                    </div>
                                    <div class="ns-f-w-group">
                                        <label for="pasword">Mot de passe :</label>
                                        <input id="pasword" class="form-control ns-form-pink" type="password" name="password" required="required">
                                    </div>
                                    <div class="ns-f-w-group">
                                        <label for="password-v">Confirmation :</label>
                                        <input id="password-v" class="form-control ns-form-pink" type="password" name="password-v" required="required">
                                    </div>
                                    <div class="ns-f-w-group">
                                        <label for="birth">Date de naissance :</label>
                                        <input id="birth" class="form-control ns-form-pink" type="date"  name="birth" required="required">
                                    </div>
                                    <div class="ns-f-w-group align-self-center">
                                        <div class="form-check">
                                            <input id="ns-i-check-news" class="form-check-input  ns-form-check" type="checkbox" name="newsletter">
                                            <label for="ns-i-check-news" class="form-check-label">Newsletter</label>
                                        </div>
                                        <div class="form-check">
                                            <input  id="ns-i-check-cgu" class="form-check-input ns-form-check" type="checkbox" name="cgu" required="required">
                                            <label for="ns-i-check-cgu" class="form-check-label">CGU</label>
                                        </div>
                                    </div>
                                    <div id="ns-fr-captcha" class="ns-fr-captcha">
            
                                    </div>
                                    <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit">S'enregister</button>
                                </form>
                            </div>
                            <div class="row">
                                <p>Tu as déja un compte ? <ns-a href="/auth/login">Se connecter</ns-a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `
    }

    constructor(app) {
        super(app, false, false, false);
    }


    build(parent, vars) {
        super.build(parent, vars);
        _('#ns-re-form').addEventListener('submit', this.sendRegister.bind(this));
        this.captcha = new Captcha(this.app);
        this.captcha.build(_('#ns-fr-captcha'));
    }

    sendRegister(event) {
        event.preventDefault();
        if (!this.isSending) {
            this.isSending = true;
            // clear pw
            const fd = new FormData(event.target);

            _("#pasword").value = '';
            _("#password-v").value = '';
            sendApiPostRequest('auth/register', fd, this.registerResult.bind(this));
        }
    }

    registerResult(event) {
        const repType = checkApiResStatus(event);
        if (repType === API_REP_OK) {
            const rep = getDataAPI(event);
            this.app.session["mail_token"] = rep["mail_token"];
            this.app.session["user_id"] = rep["user_id"];
            this.app.changePage('/auth/wait-verification');
        } else {
            this.isSending = false;
            const error =  _('#ns-log-error');
            error.style.display = 'inherit';
            if (repType === API_REP_BAD) {
                error.innerHTML = '';
                for (let err of getAPIErrorReason(event)) {
                    createPromise('p', null, error, 'my-1', 'justify-content-center').then(e => e.innerText = err);
                }
            } else {
                error.innerText = 'Une erreur de connection est survenue...';
            }
            this.captcha = new Captcha(this.app);
            this.captcha.build(_('#ns-fr-captcha'));
        }
    }
}
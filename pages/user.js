export default class extends Pages {

    user;
    dataBlock;
    isSelf;

    get raw() {
        let html = `
        <section>
            <ns-api-data-block id="ns-profile-data" href="user/${this.user}">
                <div class="ns-min-vh-100 ns-center py-5 ns-text-black">
                    <div class="ns-scan-preview-profil">
                        <section class="flex-row d-flex">
                            <div class="col-md-8 d-flex justify-content-start align-items-center gap-3">
                                <div class="p-2">
                                    <img src="/res/profile.webp" alt="profilePhoto" class="ns-avatar img-circle img-responsive">
                                </div>
                                <div class="p-2">
                                    <h3><ns-api-data field="username"></ns-api-data></h3>
                                    <span><ns-api-data field="age"></ns-api-data> ans</span>
                                </div>
                            </div>
                            <div class="d-flex flex-column justify-content-end">
                                <div class="p-2">
                                    <ns-a  href="user/${this.user}/projet">Voir mes projets</ns-a>
                                </div>
                                <div class="p-2">
                                    <span> Rejoint le <ns-api-data field="join"></ns-api-data></span>
                                </div>
                                <div class="p-2">
                                    <span> Dernière activité <ns-api-data field="last_sean"></ns-api-data></span>
                                </div>
                            </div>
                        </section>
                        <div class="ns-center py-5 ns-text-white">
                            <div class="ns-section-block ns-b-purple-gradient">
                                <h4 class="ns-scan-preview-tile">Scans aimés</h4>
                                <div class="ns-scan-preview-elements">
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ns-center py-5 ns-text-white">
                            <div class="ns-section-block ns-b-purple-gradient">
                                <h4>Scans uploadés</h4>
                                <div class="ns-scan-preview-elements">
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                    <div class="ns-scan-preview-component">
                                        <a href="/">
                                            <img src="../../res/book/love-is-war.jpg" alt="">
                                        </a>
                                        <span>Love Is War</span>
                                    </div>
                                </div>
                            </div>
                        </div>
        `
        if (this.isSelf) {
            html += `
                        <div class="ns-center py-5 ns-text-white ">
                            <div class="ns-section-block ns-b-purple-gradient">
                                <section>
                                    <h3>Modifier le profil</h3>
        <!--<?php
                if (!empty($errors_edit)) {
                    echo "<div class='row rounded mt-2 ns-b-azalea ns-text-red'>";
                    foreach ($errors_edit as $err) {
                        echo "<p class='my-1 justify-content-center'>" . $err . "</p><br>";
                    }
                    echo "</div>";
                                }
        ?>-->
                                    <form method="post" id="ns-profile-edit" class="my-3">
                                        <input class="d-none" name="type" value="edit" type="hidden">
                                        <input class="d-none" name="id" value="<?php echo $id ?>" type="hidden">
                                        <div class="ns-f-w-group">
                                            <label for="email">Adresse E-mail :</label>
                                            <input id="email" class="ns-data-field-var form-control ns-form-deep-mauve" type="email" name="email" required="required" value="$email$">
                                        </div>
                                        <div class="ns-f-w-group">
                                            <label for="username">Pseudo :</label>
                                            <input id="username" class="ns-data-field-var form-control ns-form-deep-mauve" type="text" name="username" required="required" value="$username$">
                                        </div>
                                        <div class="ns-f-w-group">
                                            <label for="birth">Date de naissance :</label>
                                            <input id="birth" class="ns-data-field-var form-control ns-form-deep-mauve" type="date" name="birth" required="required" value="$birthday$">
                                        </div>
                                        <h5>Modifier le mot de passe</h5>
                                        <p>Si vous ne souhaitez pas modifier votre mot de passe, merci de ne pas remplir les champs ci-dessous.</p>
                                        <div class="ns-f-w-group">
                                            <label for="password">Mot de passe :</label>
                                            <input id="password" class="form-control ns-form-deep-mauve" type="password" name="password">
                                        </div>
                                        <div class="ns-f-w-group">
                                            <label for="password-v">Confirmation :</label>
                                            <input id="password-v" class="form-control ns-form-deep-mauve" type="password" name="password-v">
                                        </div>
                                        <p>Pour des raisons de sécurité, veuillez renseigner à nouveau votre mot de passe pour toute modification !</p>
                                        <div class="ns-f-w-group">
                                            <label for="password-c">Mot de Passe actuelle :</label>
                                            <input id="password-c" class="form-control ns-form-deep-mauve" type="password" name="password-c">
                                        </div>
                                        <button class="form-control ns-form-deep-mauve w-100 w-md-50 mx-auto mt-4" type="submit">Modifier</button>
                                    </form>
                                </section>
                            </div>
                        </div>
                        <div class="ns-center pb-5 ns-text-white">
                            <div class="ns-section-block ns-b-purple-gradient">
                                <section>
                                    <h3>Zone dangereuse</h3>
                                    <p>Suppression du compte : Une fois ton compte supprimé, tu ne peux pas revenir en arrière !</p>
                                    <div class ="ns-center">
                                        <button class="ns-form-danger py-2 w-100 w-md-50 mx-auto mt-4" type="submit">Supprimer le compte</button>
                                    </div>
                                </section>
                            </div>
                        </div>`
        }
                html += `
                    </div>
                </div>
            </ns-api-data-block>
        </section>
        `
        return html;
    }

    constructor(app) {
        super(app);
    }

    getHTML(vars) {
        this.user = vars["user"]
        this.isSelf = this.user === "me" || this.user === this.app.user.id;
        return this.raw;
    }

    build(parent, vars) {
        super.build(parent, vars);
        this.dataBlock = _('#ns-profile-data');
        if (this.dataBlock.dataLoad) {
            this.fetchData();
        }
        this.dataBlock.addEventListener('dataLoad', this.fetchData.bind(this));
    }

    fetchData() {
        if (this.dataBlock.isError) {
            if (this.dataBlock.error.code > 0) {
                this.app.do404();
            } else {
                this.app.fatalError();
            }
        } else {
            //console.log(this.dataBlock.rawData);
        }
    }
}
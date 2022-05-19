export default class extends Pages {

    get raw() {
        return `
<div>
    Votre compte a bien été vérifié. Vous pouvez vous connecter maintenant en cliquant ici  <ns-a href="/auth/login"> Connexion </ns-a>
</div>
        `
    }

    constructor(app) {
        super(app);
    }

}
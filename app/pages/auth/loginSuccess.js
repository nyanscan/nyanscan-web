export default class extends Pages {

    get raw() {
        return `
<div>
    Votre compte à bien était créee vous pouvez vous connecter maintant en clicant ici : <ns-a href="/auth/login"> Connexion </ns-a>
</div>
        `
    }

    constructor(app) {
        super(app);
    }

}
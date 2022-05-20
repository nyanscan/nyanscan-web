export default class extends Pages {

    get raw() {
        return `
<div>
    Lien de vérification de compte invalide ! Essayer de vous <ns-a href="/auth">connecter</ns-a> pour resevoir un nouveau mail de vérificaiton.
</div>
        `
    }

    constructor(app) {
        super(app);
    }

}
export default class extends Pages {
	title = "Évènements | NyanScan"
	
	get raw() {
		return `
		<p>Pas trop vite c'est pas fini ici</p>
		<ns-a href="/" class="btn ns-tickle-pink-btn"> Page d'accueil</ns-a>
		`;
	}
	
	//TODO to finish
	
	getHTML(vars) {
		return super.getHTML(vars);
	}
	
	build(parent, vars) {
		super.build(parent, vars);
	}
	
	constructor(app) {
		super(app);
	}
	
}
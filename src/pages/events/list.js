export default class extends Pages {

	title = "Évènements | NyanScan";
	container;
	eventsComponents = [];
	user;
	isSelf = false;
	isParticipants = false;

	c_title = 'Evènements';
	showCreate = true;
	
	get raw() {
		return `
		<section>
			<div class="ns-categ-center">
				<div class="p-4 justify-content-start">
					<h2 class="ns-text-red fw-bold ns-fs-2">${this.c_title}</h2>
					<div class="d-flex flex-column flex-md-row align-items-md-center align-items-stretch gap-3">
						<p class="ns-tickle-pink-bg ns-rounded-text text-center">Nombre d'évènements :&nbsp;<span id="ns-events-total" class="d-inline-block ns-empty-placeholder"></span></p>
						${this.showCreate  ? `<ns-a href="/events/create" id="ns-events-add-event" class="btn ns-tickle-pink-btn ns-hide-disconnected">Nouvelle évènement</ns-a>` : ''}
						${this.user !== undefined ? `<ns-a href="/u/${this.user}" class="btn ns-tickle-pink-btn">Revenir au profil</ns-a>` : ''}
					</div>
				</div>
			</div>
			<h1 class="ns-fs-1"></h1>
			<div class="ns-center d-flex">
				<hr class="ns-line">
			</div>
			<div id="ns-events-container" class="d-flex flex-column ns-categ-center ns-empty-placeholder">
			
			</div>
		</section>
		`;
	}

	getHTML(vars) {
		if (vars["user"]) {
			this.user = vars["user"]
			this.isSelf = this.user === "me";
			this.isParticipants = vars['type'] === 'participate';
			if (this.isParticipants) {
				this.showCreate = false;
				this.c_title = this.isSelf ? 'Les évènements auxquels tu participes' : `Les évènements auxquels ${this.user} participe`;
			} else {
				this.showCreate = this.isSelf;
				this.c_title = this.isSelf ? 'Vos Evènements' : `Evènements de ${this.user}`;
			}
		}
		return super.getHTML(vars);
	}
	
	build(parent, vars) {
		super.build(parent, vars);
		this.container = _('#ns-events-container');
		let uri = 'events';
		if (this.user !== undefined) {
			if (this.isParticipants) uri += '?participant=';
			else uri += '?author='
			uri += this.user;
		}
		sendApiGetFetch(uri).then(r => {
			console.log(r);
			r.forEach(event => {
				const evt = new EventElement(this.app, event);
				this.eventsComponents.push(evt);
				evt.build(this.container);
			});
			_('#ns-events-total').innerText = r.length;
		})
			.catch(r => window.APP.openInfoModal(TYPE_ERROR, 'Ouups une erreur est survenue', 'Une erreur est survenue merci de réssayer plus tard ' + r?.reason ? r.reason : ''));

	}

	constructor(app) {
		super(app);
	}

	destroy() {
		super.destroy();
		this.eventsComponents.forEach(e => e.destroy());
		delete this.eventsComponents;
	}

}
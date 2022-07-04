export default class extends Pages {

	get raw() {
		return `
		<p>Pas trop vite c'est pas fini ici</p>
		<ns-a href="/" class="btn ns-tickle-pink-btn"> Page d'accueil</ns-a>
		`;
	}

	constructor(app) {
		super(app);
	}
}

/*
export default class extends Pages {
	
	id;
	isSending = false;
	
	block;
	previewCanvas;
	pictureInput;
	errorBlock;
	previewCTX;
	previewImage;
	eventEditForm;
	
	get raw() {
		return `
        <section>
            <div id="ns-p-edit-err" class="alert alert-danger" style="display: none">
            
            </div>
            <ns-api-data-block id="ns-p-edit-block" href="project/${this.id}">
            <h2>Modification de <ns-api-data field="title"></ns-api-data></h2>
            <form id="ns-event-edit-form">
                <input type="hidden" hidden="hidden" name="project" value="${this.id}">
                <div>
                    <div>
                        <div style="width: 180px;height: 240px;overflow: hidden">
                               <canvas id="ns-event-edit-preview" width="230" height="240"></canvas>
                        </div>
                    </div>
                    <div>
                        <u>Vignette de la page du tome</u>
                        <div>
                            Ration: 8/6 <br>
                            Format : JPG ou GIF<br>
                            Poids : 500Ko max.
                        </div>
                        <p>
                            Celle-ci représentera le manga sur Nyanscan, c'est ce que les lecteurs verront en premier avant de le lire !
                        </p>
                        <input id="ns-p-edit-picture" type="file" name="picture" accept="image/png,image/jpeg">
                    </div>volume
                </div>
                <div>
                    <div class="ns-form-group">
                        <label for="ns-event-title" class="form-label">Titre/Nom de l'évènement</label>
                        <input id="ns-event-title" name="title" type="text" class="form-control" required>
                        <div class="form-text">Titre ou nom de votre évènement. Veillez à qu'il soit bien représentatif de ce dernier !</div>
                    </div>
                    <div class="ns-form-group">
                            <label for="ns-event-dateStart" class="form-label">Date et heure de début de l'évènement</label>
                            <input id="ns-event-dateStart" name="dateStart" type="datetime-local" class="form-control" required>
                            <div class="form-text">Date et heure de début de votre évènement.</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-dateEnd" class="form-label">Date et heure de fin de l'évènement</label>
                            <input id="ns-event-dateEnd" name="dateEnd" type="datetime-local" class="form-control" required>
                            <div class="form-text">Date et heure de fin de votre évènement.</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-nbPer" class="form-label">Nombre de personnes maximum</label>
                            <input id="ns-event-nbPer" name="nbPer" type="number" class="form-control">
                            <div class="form-text">Nombre de personnes maximum pouvant s'inscrire (laisser vide s'il n'y a pas lieu).</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-typePre" class="form-label">Type de présence</label>
                            <select id="ns-event-typePre" name="format" class="form-select">
                                <option value="1" selected>Présentiel</option>
                                <option value="2">Distanciel/Webinaire</option>
                            </select>
                            <div class="form-text">Le type de présence pourra être changé par la suite si besoin.</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-address" class="form-label">Adresse de l'évènement (si présentiel)</label>
                            <input id="ns-event-address" name="address" type="text" class="form-control">
                            <div class="form-text">Numéro et nom de rue (En plus du nom du bâtiment s'il y a lieu), code postal et ville (Pays s'il y a lieu également).</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-contactName" class="form-label">Nom du contact (Inscription, questions,...)</label>
                            <input id="ns-event-contactName" name="contactName" type="text" class="form-control" required>
                            <div class="form-text">Nom de la personne contact de l'évènement (chargé des inscriptions,...).</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-contactTel" class="form-label">Numéro de téléphone du contact</label>
                            <input id="ns-event-contactTel" name="contactTel" type="tel" class="form-control" required>
                            <div class="form-text">Numéro de la personne contact de l'évènement (chargé des inscriptions,...).</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-link" class="form-label">Lien de l'évènement (s'il y a lieu)</label>
                            <input id="ns-event-link" name="link" type="url" class="form-control">
                            <div class="form-text">Lien du site organisateur de l'évènement (s'il y a lieu).</div>
                        </div>
                        <div class="ns-form-group">
                            <label for="ns-event-description" class="form-label">Description</label>
                            <textarea id="ns-event-description" name="description" class="form-control" rows="4" maxlength="2000" required></textarea>
                            <div class="form-text">Description de l'évènement. Soyez précis et explicit ! (max. 2000 char.)</div>
                        </div>
                </div>
                <div>
                    <button class="form-control ns-form-pink w-100 w-md-50 mx-auto mt-4" type="submit">Valider</button>
                </div>
            </form>
            </ns-api-data-block>
        </section>
        `;
	}
	
	build(parent, vars) {
		this.id = vars["event"];
		if (!this.id) {
			this.app.do404();
		}
		super.build(parent, vars);
		this.eventEditForm = _('#ns-event-edit-form');
		this.block = _('#ns-event-edit-block');
		this.previewCanvas = _('#ns-event-edit-preview');
		this.previewCTX = this.previewCanvas.getContext('2d');
		this.pictureInput = _('#ns-event-edit-picture');
		this.errorBlock = _('#ns-event-edit-err');
		if (this.block.dataLoad) {
			this.checkAPIErr();
		}
		this.block.addEventListener('dataLoad', this.checkAPIErr.bind(this));
		this.pictureInput.addEventListener('change', this.imagePreviewChange.bind(this));
		this.previewImage = new Image();
		this.previewImage.onload = (function () {
			this.previewCTX.drawImage(this.previewImage, 0, 0, 320, 240);
		}).bind(this);
		this.eventEditForm.addEventListener('submit', this.send.bind(this));
	}
	
	checkAPIErr() {
		if (this.block.isError) {
			this.app.do404();
		}
	}
	
	imagePreviewChange(event) {
		if(this.pictureInput.files) {
			const file = this.pictureInput.files[0];
			if (file.type === 'image/png' || file.type === 'image/jpeg') {
				if (file.size <= 1_000_000) {
					window.URL = window.URL || window.webkitURL;
					this.pictureURL = window.URL.createObjectURL(file);
					this.previewImage.src = this.pictureURL;
				} else  {
					// todo warn
					this.pictureInput.value = '';
					console.warn('too heavy');
				}
			} else {
				//todo warn
				this.pictureInput.value = '';
				console.warn('invalid format');
			}
		} else {
			this.previewImage.src = '';
		}
	}
	
	send(event) {
		event.preventDefault();
		if (this.isSending) return;
		this.isSending = true;
		const fd = new FormData(event.target);
		loadingScreen(true);
		sendApiPostRequest('events/edit', fd, this.sendCallback.bind(this), this.sendProgressCallback.bind(this));
	}
	
	sendProgressCallback(event) {
		console.log(event);
		const percent = Math.round( (event.loaded / event.total) * 100);
		this.app.loading.progress = percent;
		if (percent >= 100)
			this.app.loading.textHtml = `Modification de votre évènement en cours... Vous pouvez aller à la page <ns-a class="ns-tickle-pink-btn ns-btn-sm">d'accueil</ns-a> le temps que le processus se termine ou patientez : Vous serez automatiquement redirigé à la fin.`
	}
	
	sendCallback(event) {
		this.isSending = false;
		loadingScreen(false);
		const $repStatus = checkApiResStatus(event);
		if ($repStatus === API_REP_OK) {
			// todo: toast
			this.app.changePage('/e/' + this.id);
		} else if ($repStatus === API_REP_BAD) {
			const err = getAPIErrorReason(event);
			this.errorBlock.innerHTML = '';
			this.errorBlock.style.display = 'block';
			for (let errElement of err) {
				createPromise('e', null, this.errorBlock).then(e => e.innerText = errElement);
			}
		} else {
			//todo warn
			console.warn('error upload');
		}
	}
	
	constructor(app) {
		super(app);
	}
} */
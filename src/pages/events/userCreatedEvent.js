export default class extends Pages {
	
	data;
	
	getEventTemplate(event) {
		let html = `
        <div>
            <ns-a href="/e/${event["id"]}"><img src="${image_id_to_path(event["picture"])}" alt="${event["title"]}"></ns-a>
            <div>
                <span>${ escapeHtml(event["title"])}</span>
            </div>
                `;
		if (this.isSelf) {
			html += `
                    <div>
                        <span>Status: ${event_status_to_html(event.status)}</span>
                        <ns-a href="/e/${event["id"]}/edit">Edit</ns-a>
                    </div>
                `;
		}
		
		html +=
			"</div>";
		return html;
	}
	
	get raw() {
		return `
        <section>
            <div>
                ${this.isSelf ? 'Vos évènements' : " <!--TODO : Name-->"}
            </div>
            <div>
                <ns-api-data-block id="ns-user-event-data">
                
                </ns-api-data-block>
            </div>
        </section>
        `;
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
		this.data = _('#ns-user-event-data');
		this.data.addEventListener('dataLoad', this.dataLoad.bind(this));
		this.data.href = 'event/user/' + this.user;
	}
	
	dataLoad(event) {
		if (!event.isError) {
			for (const eventCreated of this.data.rawData) {
				createPromise('div', null, this.data).then(e => {
					e.innerHTML = this.getEventTemplate(eventCreated);
				})
			}
		} else {
			this.app.changePage('/');
		}
	}
}
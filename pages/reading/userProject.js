export default class extends Pages {

    data;

    getBookTemplate(project) {
        let html = `  
<div>
    <img src="${image_id_to_patch(project["picture"])}" alt="${project["title"]}">
    <div>  
        <span>${ escapeHtml(project["title"])}</span>
    </div>         
        `;
        if (this.isSelf) {
            html += `
    <div>
        <span>Status: ${project_status_to_html(project.status)}</span>
        <ns-a>Edit</ns-a>
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
        ${this.isSelf ? 'Vos projet' : "Projet de todo nom"}
    </div>
    <div>
        <ns-api-data-block id="ns-user-project-data">
        
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
        this.data = _('#ns-user-project-data');
        this.data.addEventListener('dataLoad', this.dataLoad.bind(this));
        this.data.href = 'project/user/' + this.user;
    }

    dataLoad(event) {
        if (!event.isError) {
            for (const project of this.data.rawData) {
                createPromise('div', null, this.data).then(e => {
                    e.innerHTML = this.getBookTemplate(project);
                })
            }
        } else this.app.changePage('/');

    }

}
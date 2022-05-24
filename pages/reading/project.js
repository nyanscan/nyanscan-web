export default class extends Pages {

    project;
    data;

    get raw() {
        return `
<section>
    <ns-api-data-block id="ns-pr-data" href="project/${this.project}/volumes">
        <div class="ns-container ns-pr-info">
            <img src="$%picture%.picture$" class="ns-data-field-var ns-pr-picture" alt="$title$">
            <div class="ns-pr-desc">
                <h1 class="ns-fs-1" ><ns-api-data field="title" id="ns-pr-title"></ns-api-data></h1>
                <p class="ns-fs-5 ns-text-black"><ns-api-data field="description"></ns-api-data></p>
            </div>
        </div>
        <div class="ns-pr-vol ns-container">
            <h3>Listes des tomes</h3>
            <div id="ns-pr-vol-list">
            
            </div>
        </div>
    </ns-api-data-block>
    <template id="ns-pr-template">
        <div class="ns-pr-volume">
            <ns-a href="/p/${this.project}/$id$" class="ns-template-var-attr">
                <img class="ns-pr-volume-img">
                <div class="ns-pr-vol-desc">
                    <span>Tome n° <ns-api-data field="volumes.$id$.volume" class="ns-template-var-attr"></ns-api-data></span>
                    <span><ns-api-data field="volumes.$id$.title" class="ns-template-var-attr"></ns-api-data></span>
                </div>
            </ns-a>
        </div>
    </template>    
</section>
        `;
    }

    build(parent, vars) {
        if (!vars["project"]) this.app.do404();
        this.project = vars["project"];
        super.build(parent, vars);
        this.data = _('#ns-pr-data');
        if (this.data.dataLoad) this.dataLoad();
        this.data.addEventListener('dataLoad', this.dataLoad.bind(this));
    }

    dataLoad() {
        if (this.data.isError) this.app.do404();
        const title = _('#ns-pr-title');
        if (title.innerText.length > 60) title.classList.add('ns-fs-3');
        else if (title.innerText.length > 30) title.classList.add('ns-fs-2');
        const template = _('#ns-pr-template');
        const container = _('#ns-pr-vol-list');
        const volumes = this.data.rawData["volumes"];
        for (const volID in volumes) {
            const clone = importTemplate(template, {"id": volID});
            clone.querySelector('.ns-pr-volume-img').src = image_id_to_patch(volumes[volID]["picture"]);
            container.appendChild(clone);
        }
        template.remove();

    }

    constructor(app) {
        super(app);
    }
}
export default class extends Pages {

    data;
    project;
    volume;
    page = 1;
    maxPage = 1;
    pages = [];
    view;

    progress;

    get raw() {
        return `
<section>
    <ns-api-data-block id="ns-reading-data" href="project/${this.project}/${this.volume}">
    <div class="ns-reading-head">
        <h1><ns-api-data field="project_title"></ns-api-data></h1>
        <h2><ns-api-data field="volume_title"></ns-api-data><</h2>
    </div>
    <div  class="ns-reading-view-contain">
        <div class="ns-reading-progress"><span class="ns-reading-progress-in"></span></div>
        <img id="ns-reading-image" src="">
        <div class="ns-reading-progress"><span class="ns-reading-progress-in"></span></div>
        <div class="ns-reading-nav">
            <button id="ns-reading-next">Suivant</button>
            <button id="ns-reading-previous">Précédent</button>
        </div>
    </div>
    </ns-api-data-block>
</section>`;
    }

    build(parent, vars) {
        if (!vars["project"] || !vars["volume"]) this.app.do404();
        this.project = vars["project"];
        this.volume = vars["volume"];
        super.build(parent, vars);
        this.page = Math.max(0, vars["page"]||0);
        this.data = _('#ns-reading-data');
        if (this.data.dataLoad) this.setup();
        this.data.addEventListener('dataLoad', this.setup.bind(this));
        this.progress = _('.ns-reading-progress-in');
        this.view = _('#ns-reading-image');
        _('#ns-reading-next').addEventListener('click', this.changePage.bind(this, true));
        _('#ns-reading-previous').addEventListener('click', this.changePage.bind(this, false));
    }

    setup() {
        if (this.data.isError) {
            this.app.do404();
        }
        else  {
            if (this.data.rawData['reading_direction'] === '2') _('.ns-reading-view-contain').forEach(value => value.classList.add('classic'));
            this.maxPage = this.data.rawData["page_count"];
            this.pages = this.data.rawData["data"]["pages"];
            this.page = Math.min(this.maxPage, this.page);
            this.update();
        }
    }

    changePage(increment) {
        if (!this.pages) return;
        if (increment){
            if (this.page + 1 < this.maxPage) {
                this.page++;
                this.update();
            }
        } else  {
            if (this.page > 0) {
                this.page--;
                this.update();
            }
        }
    }

    update() {
        if (!this.pages) return;
        const adv = Math.round((this.page / (this.maxPage - 1)) * 10000) / 100;
        this.progress.forEach(e => e.style.width = `${adv}%`);

        const currentIMG = this.pages[this.page];

        this.view.src = `volume/${currentIMG.substr(0, 3)}/${currentIMG.substr(3)}.jpg`

        window.history.pushState("", "",  `${(this.app.prefix ? `/${this.app.prefix}/` : '/')}p/${this.project}/${this.volume}/${this.page}`);
    }

    constructor(app) {
        super(app);
    }

}
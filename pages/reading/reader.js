export default class extends Pages {

    data;
    project;
    volume;
    page = 1;
    maxPage = 1;
    pages = [];
    view;
    haveStickyHeader = false;

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
        <div class="ns-reading-progress"><span class="ns-reading-progress-hover">10</span> <span class="ns-reading-progress-in"></span></div>
        <img id="ns-reading-image" src="">
        <div class="ns-reading-progress"><span class="ns-reading-progress-hover">10</span> <span class="ns-reading-progress-in"></span></div>
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
        this.bindKeyListener = this.keyListener.bind(this);
        document.addEventListener('keydown',  this.bindKeyListener);
        for (let pr of _('.ns-reading-progress')) {
            pr.addEventListener('mousemove', this.progressHover.bind(this, pr));
            pr.addEventListener('click', this.progressHoverClick.bind(this, pr));
        }
    }

    progressHover(pr, event) {
        if (event.pageX >= pr.offsetLeft && event.pageX <=pr.offsetLeft + pr.offsetWidth) {
            const x = this.directionJP ? pr.offsetWidth - (event.pageX - pr.offsetLeft) : (event.pageX - pr.offsetLeft);
            const p = Math.ceil(x / pr.offsetWidth * this.maxPage);
            const tool = pr.querySelector('.ns-reading-progress-hover');
            tool.innerText = p;
            tool.style.left = `${(event.pageX - pr.offsetLeft) - 20}px`;
        }
    }

    progressHoverClick(pr, event) {
        const x = this.directionJP ? pr.offsetWidth - (event.pageX - pr.offsetLeft) : (event.pageX - pr.offsetLeft);
        const p = Math.ceil(x / pr.offsetWidth * this.maxPage) - 1;
        if (p !== this.page) {
            this.page = p;
            this.update();
        }
    }

    keyListener(event) {
        if(event.keyCode === 37) {
            this.changePage(this.directionJP);
        }
        else if(event.keyCode === 39) {
            this.changePage(!this.directionJP);
        }
    }

    setup() {
        if (this.data.isError) {
            this.app.do404();
        }
        else  {
            this.directionJP = this.data.rawData['reading_direction'] === '1';
            if (!this.directionJP) _('.ns-reading-view-contain').forEach(value => value.classList.add('classic'));
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

    destroy() {
        super.destroy();
        document.removeEventListener('keydown',  this.bindKeyListener);
    }

    constructor(app) {
        super(app);
    }

}
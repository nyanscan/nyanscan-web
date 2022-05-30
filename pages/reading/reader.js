export default class extends Pages {

    haveStickyHeader = false;

    data;
    project;
    volume;
    page = 1;
    maxPage = 1;
    pages = [];
    caches = [];
    view;
    zoomValue = 1;
    zoomMoreBtn;
    zoomLessBtn;

    progress;

    get raw() {
        return `
<section>
    <ns-api-data-block id="ns-reading-data" href="project/${this.project}/${this.volume}">
    <div class="ns-reading-head">
        <h1><ns-api-data field="project_title"></ns-api-data></h1>
        <h2><ns-api-data field="volume_title"></ns-api-data></h2>
    </div>
    <div  class="ns-reading-view-contain">
        <div class="ns-reading-zoom-btn">
            <button id="ns-reading-zoom-less" class="ns-reading-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-out" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
  <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
  <path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
</svg></button><button id="ns-reading-zoom-more" class="ns-reading-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
  <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
  <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
</svg></button>
        </div>
        <div class="ns-reading-progress"><span class="ns-reading-progress-hover">10</span> <span class="ns-reading-progress-in"></span></div>
        <div class="ns-reading-view">
            <img id="ns-reading-image" src="" alt="book-page">
        </div>
        
        <div class="ns-reading-progress"><span class="ns-reading-progress-hover">10</span> <span class="ns-reading-progress-in"></span></div>
        <div class="ns-reading-nav">
            <button id="ns-reading-next" class="ns-reading-btn">Suivant</button>
            <button id="ns-reading-previous" class="ns-reading-btn">Précédent</button>
        </div>
        <div class="mb-4">
            <ns-a class="ns-reading-btn" href="/p/${this.project}">Revenir au projet</ns-a>
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
        this.zoomMoreBtn = _('#ns-reading-zoom-more');
        this.zoomLessBtn = _('#ns-reading-zoom-less');
        this.zoomMoreBtn.addEventListener('click', this.zoom.bind(this, true));
        this.zoomLessBtn.addEventListener('click', this.zoom.bind(this, false));
        this.view.addEventListener('load', this.calculateViewSize.bind(this));
        _('#ns-reading-next').addEventListener('click', this.changePage.bind(this, true));
        _('#ns-reading-previous').addEventListener('click', this.changePage.bind(this, false));
        this.bindKeyListener = this.keyListener.bind(this);
        document.addEventListener('keydown',  this.bindKeyListener);
        for (let pr of _('.ns-reading-progress')) {
            pr.addEventListener('mousemove', this.progressHover.bind(this, pr));
            pr.addEventListener('click', this.progressHoverClick.bind(this, pr));
        }
    }

    preloadImage(url) {
        if (!this.caches[url])
        {
            this.caches[url] =  new Image();
            this.caches[url].src = url;
        }

    }

    zoom(more) {
        if (more) {
            if (this.zoomValue < 2) {
                this.zoomValue += .1;
            }
        } else {
            if (this.zoomValue > 0.2) {
                this.zoomValue -= 0.1;
            }
        }
        this.updateZoomBtn();
        this.calculateViewSize();
    }

    updateZoomBtn() {
        this.zoomMoreBtn.disabled = (this.zoomValue >= 2);
        this.zoomLessBtn.disabled = (this.zoomValue <= 0.2);
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
            event.preventDefault();
            this.changePage(this.directionJP);
        }
        else if(event.keyCode === 39) {
            event.preventDefault();
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
        this.cacheNext();

        window.history.pushState("", "",  `${(this.app.prefix ? `/${this.app.prefix}/` : '/')}p/${this.project}/${this.volume}/${this.page}`);
    }

    cacheNext() {
        for (let i = this.page + 1; i < this.page + 4 && this.page < this.maxPage; i++) {
            const currentIMG = this.pages[i];
            this.preloadImage(`volume/${currentIMG.substr(0, 3)}/${currentIMG.substr(3)}.jpg`);
        }
    }

    calculateViewSize() {

        if (this.view.naturalHeight > this.view.naturalWidth) {
            this.view.style.height = (1000 * this.zoomValue) + 'px';
            this.view.style.width = '';
        } else {
            this.view.style.height = '';
            this.view.style.width = (800 * this.zoomValue) + 'px';
        }
    }

    destroy() {
        super.destroy();
        document.removeEventListener('keydown',  this.bindKeyListener);
    }

    constructor(app) {
        super(app);
    }

    get_client_url() {
        return `/p/${this.project}/${this.volume}`;
    }

}
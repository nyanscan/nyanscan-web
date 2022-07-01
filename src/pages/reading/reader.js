const DF45D = [38,38,40,40,37,39,37,39,66,65];

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
    likeBTN;
    dislikeBTN;
    currentReadingUpdate = null;
    forcePage = false;
    keyHistory = [];

    progress;

    get raw() {
        return `
        <section>
            <ns-api-data-block id="ns-reading-data" href="project/${this.project}/${this.volume}">
                <div class="ns-reading-head">
                    <h1 class="ns-fs-1 ns-md-fs-2"><ns-api-data field="project_title"></ns-api-data></h1>
                    <h2 class="ns-fs-2 ns-md-fs-3"><ns-api-data field="volume_title"></ns-api-data></h2>
                </div>
                <div  class="ns-reading-view-contain">
                    <div class="ns-reading-zoom-btn">
                        <button id="ns-reading-zoom-less" class="ns-reading-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-out" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                                <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
                                <path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </button>
                        <button id="ns-reading-zoom-more" class="ns-reading-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                                <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z"/>
                                <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="ns-reading-progress">
                        <span class="ns-reading-progress-hover">10</span>
                        <span class="ns-reading-progress-in"></span>
                    </div>
                    <div class="ns-reading-view">
                        <img id="ns-reading-image" src="" alt="book-page">
                    </div>
                    <div class="ns-reading-progress">
                        <span class="ns-reading-progress-hover">10</span>
                        <span class="ns-reading-progress-in"></span>
                    </div>
                    <div class="ns-reading-nav">
                        <button id="ns-reading-next" class="ns-reading-btn">Suivant</button>
                        <button id="ns-reading-previous" class="ns-reading-btn">Précédent</button>
                    </div>
                    <div class="ns-reading-like ns-hide-disconnected my-3">
                        <i id="ns-reading-like" class="bi text-success bi-hand-thumbs-up"></i>
                        <i id="ns-reading-dislike" class="bi text-danger bi-hand-thumbs-down"></i>
                    </div>
                    <div class="mb-4">
                        <ns-a class="ns-reading-btn" href="/p/${this.project}">Revenir au projet</ns-a>
                    </div>
                </div>
            </ns-api-data-block>
        </section>
        `;
    }

    build(parent, vars) {
        if (!vars["project"] || !vars["volume"]) {
            this.app.do404();
            return;
        }
        this.project = vars["project"];
        this.volume = vars["volume"];
        super.build(parent, vars);
        this.page = Math.max(0, vars["page"]||0);
        this.forcePage = vars["page"] !== undefined;
        this.data = _('#ns-reading-data');
        if (this.data.dataLoad) {
            this.setup();
        }
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
        this.bindPopState = this.popstate.bind(this);
        document.addEventListener('keydown',  this.bindKeyListener);
        for (let pr of _('.ns-reading-progress')) {
            pr.addEventListener('mousemove', this.progressHover.bind(this, pr));
            pr.addEventListener('click', this.progressHoverClick.bind(this, pr));
        }
        if (window.innerWidth < 768){
            this.zoomValue = 0.6;
            this.updateZoomBtn();
            this.calculateViewSize();
        }
        this.likeBTN = _('#ns-reading-like');
        this.dislikeBTN = _('#ns-reading-dislike');
        this.likeBTN.addEventListener('click', this.likeClick.bind(this, false));
        this.dislikeBTN.addEventListener('click', this.likeClick.bind(this, true));
        this.app.addEventListener('popstate', this.bindPopState);
    }

    popstate(e) {
        const href = e.detail.href;
        const matches = href.match(/^\/p\/(\d+)\/(\d+)\/(\d+)\/?$/);
        if (matches && matches.length === 4 && matches[1] === this.project && matches[2] === this.volume) {
            e.preventDefault();
            this.page = Math.max(0, parseInt(matches[3]));
            this.page = Math.min(this.maxPage - 1, this.page);
            this.update(true);
        }
    }



    preloadImage(url) {
        if (!this.caches[url]) {
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
        this.keyHistory.push(event.keyCode);
        if (this.keyHistory.length >= 10)
            this.keyHistory = this.keyHistory.slice(-10);
        if(event.keyCode === 37) {
            event.preventDefault();
            this.changePage(this.directionJP);
        } else if(event.keyCode === 39) {
            event.preventDefault();
            this.changePage(!this.directionJP);
        }
        if (this.keyHistory.length === 10 && this.keyHistory.every((value, index) => DF45D[index] === value)) {
            console.log("Code Konami");
        }
    }

    likeClick(isNegative) {
        if (!this.app.user.isLog) return;
        const current = (isNegative ? this.dislikeBTN : this.likeBTN).classList.contains(isNegative ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-up-fill');
        this.data.rawData['user_like_status'] = current ? null : isNegative ? '1' : '0';
        sendApiGetFetch(`project/${current ? 'unlike' : isNegative ? 'dislike' : 'like'}/${this.project}/${this.volume}`).catch(console.error);
        this.updateLike();
    }

    setup() {
        if (this.data.isError) {
            this.app.do404();
        } else {
            this.directionJP = this.data.rawData['reading_direction'] === '1';
            if (!this.directionJP) _('.ns-reading-view-contain').forEach(value => value.classList.add('classic'));
            this.maxPage = this.data.rawData["page_count"];
            this.pages = this.data.rawData["data"]["pages"];
            if (!this.forcePage && this.data.rawData['user_page'] !== null) {
                this.page = Math.max(0, parseInt(this.data.rawData['user_page']));
            }
            this.page = Math.min(this.maxPage - 1, this.page);
            this.updateLike();
            this.update();
        }
    }

    updateLike() {
        this.likeBTN.classList.remove('bi-hand-thumbs-up');
        this.dislikeBTN.classList.remove('bi-hand-thumbs-down');
        this.likeBTN.classList.remove('bi-hand-thumbs-up-fill');
        this.dislikeBTN.classList.remove('bi-hand-thumbs-down-fill');
        const like_status = this.data.rawData['user_like_status'];
        if (like_status == '1') {
            this.likeBTN.classList.add('bi-hand-thumbs-up')
            this.dislikeBTN.classList.add('bi-hand-thumbs-down-fill')
        } else if (like_status == '0') {
            this.likeBTN.classList.add('bi-hand-thumbs-up-fill')
            this.dislikeBTN.classList.add('bi-hand-thumbs-down')
        } else if (like_status === null) {
            this.likeBTN.classList.add('bi-hand-thumbs-up')
            this.dislikeBTN.classList.add('bi-hand-thumbs-down')
        }
    }

    sendReadingUpdate() {
        if (this.currentReadingUpdate !== null) {
            sendApiGetFetch(`project/reading/${this.project}/${this.volume}/${this.currentReadingUpdate}`).catch(console.error);
            this.currentReadingUpdate = null;
        }
    }

    changePage(increment) {
        if (!this.pages) {
            return;
        }
        if (increment) {
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

    update(no_history=false) {
        if (!this.pages) {
            return;
        }

        if (this.page > this.maxPage) this.page = this.maxPage;
        const adv = Math.round((this.page / (this.maxPage - 1)) * 10000) / 100;
        this.progress.forEach(e => e.style.width = `${adv}%`);

        const currentIMG = this.pages[this.page];

        this.view.src = `${document.location.protocol}//res.${window.domaine}/volume/${currentIMG.substring(0, 3)}/${currentIMG.substring(3)}.webp`;
        this.cacheNext();
        if (!no_history)
            window.history.pushState("", "",  `${(this.app.prefix ? `/${this.app.prefix}/` : '/')}p/${this.project}/${this.volume}/${this.page}`);
        if (this.currentReadingUpdate === null) {
            this.currentReadingUpdate = this.page;
            setTimeout(this.sendReadingUpdate.bind(this), 5000);
        } else this.currentReadingUpdate = this.page;
    }

    cacheNext() {
        for (let i = this.page + 1; i < this.page + 4 && i < this.maxPage; i++) {
            const currentIMG = this.pages[i];
            this.preloadImage(`${document.location.protocol}//res.${window.domaine}/volume/${currentIMG.substring(0, 3)}/${currentIMG.substring(3)}.webp`);
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
        delete this.caches;
        document.removeEventListener('keydown',  this.bindKeyListener);
        this.app.removeEventListener('popstate',  this.bindPopState);
    }

    constructor(app) {
        super(app);
    }

    get_client_url() {
        return `/p/${this.project}/${this.volume}`;
    }
}
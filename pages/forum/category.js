class ModalCreateCategory extends Component {

    category;

    get raw() {
        return `
        <form id="nsa-modal-create-topic-f">
        <h3>Créer un sujet de discussion ?</h3>
        <div class="ns-form-group d-flex flex-column gap-2">
            <input type="hidden" hidden="hidden" name="category" value="${this.category}">
            <div class="form-floating">
                <input type="text" name="title" id="nsfm-edit-title" placeholder="Titre" class="form-control">
                <label for="nsfm-edit-title">Titre</label>
            </div>
            <div class="form-floating">
                <input type="text" name="message" id="nsfm-edit-description" placeholder="Message" class="form-control">
                <label for="nsfm-edit-description">Message</label>
            </div>
        </div>
        <div class="mt-3 ns-modal-btn-container">
            <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
            <button type="submit" class="ns-tickle-pink-bg">Créer</button>
        </div>
        </form>
        `;
    }
    build(parent) {
        super.build(parent);
        _('#nsa-modal-create-topic-f').addEventListener('submit', this.sendRequest.bind(this));
    }

    constructor(app, category) {
        super(app, COMPONENT_TYPE_MODAL);
        this.category = category;
        console.log(app);
    }

    sendRequest(event) {
        event.preventDefault();
        loadingScreen(true);
        this.app.closeModal();
        sendApiPostFetch('forum/topic', new FormData(event.target)).then(d => this.app.reload()).catch(console.error).finally(() => loadingScreen(false));
    }

}

export default class extends Pages {

    firstLoad = true;
    amount = 0;
    countPerPage = 5;
    dataBlock = null;
    category;
    pageTop;

    set maxPage(v) {
        this.pageTop.max = v;
        if (v <= 1) {
            this.pageTop.disabled = true;
            this.pageTop.style.display = 'none';
        }
    }

    set page(v) {
        this.dataBlock.href = `forum/category/${this.category}/topics?offset=${this.countPerPage * v}&limit=${this.countPerPage}`;
    }

    constructor(app) {
        super(app);
    }

    getHTML(vars) {
        return `
        <section>
            <ns-api-data-block id="topics-container-data" href="forum/category/${vars['category']}/topics?offset=0&limit=${this.countPerPage}&count=1">
                <div class="ns-categ-center">
                    <div class="p-4 justify-content-start">
                        <h2 class="ns-text-red fw-bold ns-fs-1"><ns-api-data field="category.name" class="ns-empty-placeholder"></ns-api-data></h2>
                        <p class="ns-fs-3"><ns-api-data field="category.description" class="ns-empty-placeholder"></ns-api-data></p> 
                        <div class="d-flex flex-row align-items-center gap-3">
                            <p class="ns-tickle-pink-bg ns-rounded-text d-inline-flex">Nombre total de postes :&nbsp;<span id="ns-categ-total" class="d-inline-block ns-empty-placeholder"></span></p>
                            <button id="ns-forum-add-topic" ns-perm-level="255" class="btn ns-tickle-pink-btn">Nouveau sujet de discussion</button>
                        </div>
                    </div>
                </div>
                <div class="ns-center d-flex">
                    <hr class="ns-line">
                </div>
                <div class="ns-center">
                    <ns-pagination id="ns-categ-page-top" min="1" value="1" max-show="5"></ns-pagination>
                </div>
                <div id="topics-container" class="d-flex flex-column ns-categ-center ns-empty-placeholder"></div>
                <div class="ns-center mb-5">
                    <ns-a href="/forum" class="btn ns-tickle-pink-btn">Retourner à la liste des catégories</ns-a>
                </div>
                
            </ns-api-data-block>
            <template id="topic-template">
                <ns-a href="/forum/t$topic$-$topic-name$" class="ns-template-var-attr ns-categ-subject mb-3 ns-a-categ ns-b-purple-gradient">
                    <h4>
                        <ns-api-data field="topics.$id$.name" class="ns-template-var-attr"></ns-api-data>
                    </h4>
                    <small>
                        <ns-api-data field="topics.$id$.date_inserted" class="ns-template-var-attr"></ns-api-data>
                    </small>
                    <div>
                        Dernière activité:
                        <small>
                            <ns-api-data field="topics.$id$.author.username" class="ns-template-var-attr">
                            
                            </ns-api-data>
                        </small>
                        <small>
                            <ns-api-data field="topics.$id$.message.date_inserted" class="ns-template-var-attr">
                            
                            </ns-api-data>
                        </small>
                    </div>
                </div>
            </template>
        </section>
        `
    }

    get title() {
        return 'Forum | NyanScan';
    }
    
    build(parent, vars) {
        super.build(parent, vars);
        this.category = vars['category'];
        this.dataBlock = _('#topics-container-data');
        if (this.dataBlock) {
            if (this.dataBlock.dataLoad) {
                this.setupTopics();
            }
            this.dataBlock.addEventListener('dataLoad', this.setupTopics.bind(this));
        }

        this.pageTop = _('#ns-categ-page-top');
        this.pageTop.addEventListener('change', this.changePage.bind(this));
        _('#ns-forum-add-topic').addEventListener('click', this.openCreateModal.bind(this));
    }

    openCreateModal(e = undefined) {
        if (e !== undefined) {
            e.preventDefault();
            // check no front cheat (also check in back in case full front change)
            if (!e.target.hasAttribute('ns-perm-level') || e.target.getAttribute('ns-perm-level') > window.APP.user.permissionLevel) {
                e.target.display = 'none';
                return;
            }
        }
        this.app.openModal(new ModalCreateCategory(this.app, this.category));
    }

    changePage(e) {
        this.page = e.detail.value - 1;
    }

    setupTopics() {
        if (this.dataBlock.isError) {
            if (this.dataBlock.error.code > 0) {
                this.app.do404();
            }else {
                this.app.fatalError();
            }
        } else {
            const raw =  this.dataBlock.rawData;

            if (this.firstLoad) {
                this.firstLoad = false;
                this.amount = raw["total"];
                this.maxPage = Math.ceil(this.amount / this.countPerPage);
                _('#ns-categ-total').innerText = this.amount;
                _('#ns-forum-add-topic').setAttribute('ns-perm-level', raw['category']['permission_create'])
                this.update_permission_item();
            }

            const container = _("#topics-container");
            container.innerHTML = '';
            const templateT = _("#topic-template");
            for (const cat in raw['topics']) {
                const urlName = encodeURIComponent(raw['topics'][cat]['name'].trim().replace(/\s/g, '-'));
                const clone = importTemplate(templateT, {"id": cat, "topic-name": urlName, "topic": raw['topics'][cat]['id']});
                container.appendChild(clone);
            }
        }
    }
}
class ModalEditCategories extends Component {

    id;
    data = [];

    get raw() {
        let html = `
        <form id="nsa-modal-edit-category-f">
        <h3>${this.id === null ? 'Créer' : 'Modifier'} une catégorie ?</h3>
        <div class="ns-form-group d-flex flex-column gap-2">
            <input type="hidden" hidden="hidden" name="id" value="${this.id}">
            <div class="form-floating">
                <input type="text" name="title" id="nsfm-edit-title" placeholder="Titre" class="form-control" value="${this.data['name'] || ''}">
                <label for="nsfm-edit-title">Titre</label>
            </div>
            <div class="form-floating">
                <input type="text" name="description" id="nsfm-edit-description" placeholder="Description" class="form-control" value="${this.data['description'] || ''}">
                <label for="nsfm-edit-description">Description</label>
            </div>
            <div class="form-floating">
                <input type="number" min="1" max="255" id="nsfm-edit-create" name="create" placeholder="Permission création"  class="form-control" value="${this.data['permission_create'] || ''}">
                <label for="nsfm-edit-create">Permission de création</label>
            </div>
            <div class="form-floating">
                <input type="number" min="0" max="255" id="nsfm-edit-view" name="view" placeholder="Permission visibilité" class="form-control" value="${this.data['permission_view'] || ''}">
                <label for="nsfm-edit-view">Permission de visibilité</label>
            </div>
            
        </div>
        <div class="mt-3 ns-modal-btn-container">
            <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
            <button type="submit" class="bg-warning">Modifier</button>
        </div>
        </form>
        `;
        return html;
    }

    build(parent) {
        super.build(parent);
        _('#nsa-modal-edit-category-f').addEventListener('submit', this.sendRequest.bind(this));
    }

    constructor(app, id = null, data = []) {
        super(app, COMPONENT_TYPE_MODAL);
        this.id = id;
        this.data = data;
        console.log(data);
    }

    sendRequest(event) {
        event.preventDefault();
        loadingScreen(true);
        this.app.closeModal();
        sendApiPostFetch('forum/category', new FormData(event.target)).then(d => this.app.reload()).catch(console.error).finally(() => loadingScreen(false));
    }

}

export default class extends Pages {

    dataBlock;

    get raw() {
        return `
        <section class="ns-theme-bg ns-theme-text">
            <div>
                <ns-a href="/" class="ns-a-clear">
                
                </ns-a>
            </div>
            <div class="ns-forum-banner">
            
            </div>
            <div class="mx-auto ns-forum-center flex-row justify-content-between mt-2">
                <div class="p-1 justify-content-start">
                    <h2>Forum</h2>
                </div>
                <div ns-perm-level="255">
                    <button id="ns-forum-add-cat" class="btn ns-tickle-pink-btn">Nouvelle Catégorie</button>
                </div>
            </div>
            <div class="ns-center d-flex">
                <hr class="ns-line">
            </div>
            <ns-api-data-block id="category-container-data" href="forum/category/root">
                <div id="category-container" class="d-flex flex-column gap-5 ns-center py-5">
        
                </div>
            </ns-api-data-block>
            <template id="category-template">
                <div class="ns-categ-topic">
                    <div class="ps-2 ns-a-categ ns-forum-categ-title">
                        <div class="d-flex flex-row justify-content-between">
                            <h3 class="ns-text-red ns-fs-3">
                                <ns-api-data field="$id$.name" class="ns-template-var-attr"></ns-api-data>
                            </h3>
                            <div ns-perm-level="255">
                                <button class="btn ns-tickle-pink-btn ns-btn-settings-cat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
    </svg>
                                </div>
                            </button>
                        </div>
                        <p>
                            <ns-api-data field="$id$.description" class="ns-template-var-attr"></ns-api-data>
                        </p>
                    </div>
                    <div class="ns-category-topic-container">
        
                    </div>
                    <ns-a href="/forum/$id$" class="ns-template-var-attr btn ns-tickle-pink-btn">
                        Voir plus...
                    </ns-a>
                </div>
            </template>
            <template id="category-template-topic">
                <ns-a href="/forum/t$topic-id$-$topic-name$" class="ns-template-var-attr ns-categ-subject mb-3 ns-a-categ ns-b-purple-gradient">
                    <h4>
                        <ns-api-data field="$id$.topics.$topic$.name" class="ns-template-var-attr"></ns-api-data>
                    </h4>
                    <small>
                        <ns-api-data field="$id$.topics.$topic$.date_inserted" class="ns-template-var-attr"></ns-api-data>
                    </small>
                    <div>
                        Dernière activité:
                        <small>
                            <ns-api-data field="$id$.topics.$topic$.last_message.author.username" class="ns-template-var-attr">
                            
                            </ns-api-data>
                        </small>
                        <small>
                            <ns-api-data field="$id$.topics.$topic$.last_message.date_inserted" class="ns-template-var-attr">
                            
                            </ns-api-data>
                        </small>
                    </div>
                </ns-a>
            </template>
        </section>
        `;
    }

    get title() {
        return 'Forum | NyanScan';
    }

    constructor(app) {
        super(app);
    }

    build(parent) {
        super.build(parent);
        this.dataBlock = _('#category-container-data');
        if (this.dataBlock) {
            if (this.dataBlock.dataLoad) {
                this.setupCategoryContainer();
            }
            this.dataBlock.addEventListener('dataLoad', this.setupCategoryContainer.bind(this));
        }
        _('#ns-forum-add-cat').addEventListener('click', (e => {
            e.preventDefault();
            if (this.app.user?.permissionLevel < 255) return;
            this.app.openModal(new ModalEditCategories(this.app));
        }).bind(this));
    }

    openEditModal(id, e) {
        if (this.app.user?.permissionLevel < 255) return;
        this.app.openModal(new ModalEditCategories(this.app, id, this.dataBlock.rawData[id]));
    }

    setupCategoryContainer() {
        const raw = this.dataBlock.rawData;
        const container = _("#category-container");
        const templateC = _("#category-template");
        const templateT = _("#category-template-topic");
        for (const cat in raw) {
            const clone = importTemplate(templateC, {"id": cat});
            const topicContainer = clone.querySelector('.ns-category-topic-container');
            for (const topic in raw[cat]["topics"]) {
                const urlName = encodeURIComponent(raw[cat]['topics'][topic]['name'].trim().replace(/\s/g, '-'));
                const cloneTopic = importTemplate(templateT, {"id": cat, "topic-name": urlName, "topic-id": raw[cat]['topics'][topic]['id'], "topic": topic.toString()});
                topicContainer.appendChild(cloneTopic);
            }

            clone.querySelector('.ns-btn-settings-cat').addEventListener('click', this.openEditModal.bind(this, cat));
            container.appendChild(clone);
        }
        this.update_permission_item();
    }
}
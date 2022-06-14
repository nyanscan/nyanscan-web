export default class extends Pages {

    firstLoad = true;
    amount = 0;

    constructor(app) {
        super(app);
    }

    getHTML(vars) {
        return `
        <section>
            <ns-api-data-block id="topics-container-data" href="forum/category/${vars['category']}/topics?offset=0&count=1">
                <div class="ns-forum-center ms-3">
                    <div class="p-4 justify-content-start">
                        <h2><ns-api-data field="category.name"></ns-api-data></h2>
                        <small><ns-api-data field="category.description"></ns-api-data></small> <br>
                        <small>Total : <ns-api-data field="total"></ns-api-data></small>
                    </div>
                </div>
                <div class="ns-center d-flex">
                    <hr class="ns-line">
                </div>
                <div class="ns-center">
                    <nav aria-label="Page Navgation">
                        <ul class="pagination">
                            <li class="page-item disabled">
                                <a class="page-link">Précédent</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#">1</a>
                            </li>
                            <li class="page-item active" aria-current="page">
                                <a class="page-link" href="#">2</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#">3</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#">Suivant</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div id="topics-container" class="d-flex flex-column ns-categ-center">
        
                </div>
                <div class="ns-center">
                    <nav aria-label="Page Navgation">
                        <ul class="pagination">
                            <li class="page-item disabled">
                                <a class="page-link">Précédent</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#">1</a>
                            </li>
                            <li class="page-item active" aria-current="page">
                                <a class="page-link" href="#">2</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#">3</a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="#">Suivant</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </ns-api-data-block>
            <template id="topic-template">
                <ns-a href="/forum/$id$/$topic$" class="ns-template-var-attr ns-categ-subject mb-3 ns-a-categ ns-b-purple-gradient">
                    <h4>
                        <ns-api-data field="topics.$id$.name" class="ns-template-var-attr">
                        
                        </ns-api-data>
                    </h4>
                    <small>
                        <ns-api-data field="topics.$id$.date_inserted" class="ns-template-var-attr">
                        
                        </ns-api-data>
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
        this.dataBlock = _('#topics-container-data');
        if (this.dataBlock) {
            if (this.dataBlock.dataLoad) {
                this.setupTopics();
            }
            this.dataBlock.addEventListener('dataLoad', this.setupTopics.bind(this));
        }
    }

    setApi(page, count=false) {

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
            }

            const container = _("#topics-container");
            const templateT = _("#topic-template");
            for (const cat in raw['topics']) {
                const clone = importTemplate(templateT, {"id": cat, "topic": raw['topics'][cat]['id']});
                container.appendChild(clone);
            }
        }
    }
}
export default class extends Pages {

    firstLoad = true;
    amount = 0;
    countPerPage = 2;
    pageVar = 0;
    dataBlock = null;
    category;
    pageTop;

    set maxPage(v) {
        this.pageTop.max = v;
        console.log(v);
    }

    set page(v) {
        this.pageVar = v;
        this.dataBlock.href = `forum/category/${this.category}/topics?offset=${this.countPerPage * this.pageVar}&limit=${this.countPerPage}`;
    }

    constructor(app) {
        super(app);
    }

    getHTML(vars) {
        return `
        <section>
            <ns-api-data-block id="topics-container-data" href="forum/category/${vars['category']}/topics?offset=${this.countPerPage * this.pageVar}&limit=${this.countPerPage}&count=1">
                <div class="ns-categ-center">
                    <div class="p-4 justify-content-start">
                        <h2 class="ns-text-red fw-bold ns-fs-1"><ns-api-data field="category.name" class="ns-empty-placeholder"></ns-api-data></h2>
                        <p class="ns-fs-3"><ns-api-data field="category.description" class="ns-empty-placeholder"></ns-api-data></p> 
                        <small>Total : <div id="ns-categ-total" class="d-inline-block ns-empty-placeholder"></div></small>
                    </div>
                </div>
                <div class="ns-center d-flex">
                    <hr class="ns-line">
                </div>
                <div class="ns-center">
                    <ns-pagination id="ns-categ-page-top" min="1" value="1" max-show="5"></ns-pagination>
                </div>
                <div id="topics-container" class="d-flex flex-column ns-categ-center ns-empty-placeholder"></div>
            </ns-api-data-block>
            <template id="topic-template">
                <ns-a href="/forum/$id$/$topic$" class="ns-template-var-attr ns-categ-subject mb-3 ns-a-categ ns-b-purple-gradient">
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
                _('#ns-categ-total').innerText = Math.ceil(this.amount / this.countPerPage);
            }

            const container = _("#topics-container");
            container.innerHTML = '';
            const templateT = _("#topic-template");
            for (const cat in raw['topics']) {
                const clone = importTemplate(templateT, {"id": cat, "topic": raw['topics'][cat]['id']});
                container.appendChild(clone);
            }
        }
    }
}
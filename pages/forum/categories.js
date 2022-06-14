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
            <div class="ns-forum-center ms-3">
                <div class="p-4 justify-content-start">
                    <h2>Forum</h2>
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
                    <ns-a href="/forum/$id$" class="ns-template-var-attr ps-2 ns-a-categ ns-forum-categ-title">
                        <h3>
                            <ns-api-data field="$id$.name" class="ns-template-var-attr "></ns-api-data>
                        </h3>
                        <p>
                            <ns-api-data field="$id$.description" class="ns-template-var-attr"></ns-api-data>
                        </p>
                    </ns-a>
                    <div class="ns-category-topic-container">
        
                    </div>
                </div>
            </template>
            <template id="category-template-topic">
                <ns-a href="/forum/$id$/$topic$" class="ns-template-var-attr ns-categ-subject mb-3 ns-a-categ ns-b-purple-gradient">
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
        `
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
    }

    setupCategoryContainer() {
        const raw =  this.dataBlock.rawData;
        const container = _("#category-container");
        const templateC = _("#category-template");
        const templateT = _("#category-template-topic");
        for (const cat in raw) {
            const clone = importTemplate(templateC, {"id": cat});
            const topicContainer = clone.querySelector('.ns-category-topic-container');
            for (const topic in raw[cat]["topics"]) {
                const cloneTopic = importTemplate(templateT, {"id": cat, "topic": topic.toString()});
                topicContainer.appendChild(cloneTopic);
            }
            container.appendChild(clone);
        }
    }
}
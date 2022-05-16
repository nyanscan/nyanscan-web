export default class extends Pages {

    dataBlock;

    get raw() {
        return `
<section class="ns-theme-bg ns-theme-text">
    <ns-api-data-block id="category-container-data" href="forum/category/root">
        <div id="category-container" class="d-flex flex-column gap-5">

        </div>
    </ns-api-data-block>
    <template id="category-template">
        <div>
            <ns-a href="/forum/$id$" class="ns-template-var-attr">
                <h3>
                    <ns-api-data field="$id$.name" class="ns-template-var-attr"></ns-api-data>
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
        <ns-a href="/forum/$id$/$topic$" class="ns-template-var-attr">
            <h4>
                <ns-api-data field="$id$.topics.$topic$.name" class="ns-template-var-attr"></ns-api-data>
            </h4>
            <small>
                <ns-api-data field="$id$.topics.$topic$.date_inserted" class="ns-template-var-attr"></ns-api-data>
            </small>
            <div>
                LAST:
                <small>
                    <ns-api-data field="$id$.topics.$topic$.last_message.author.username"
                                 class="ns-template-var-attr"></ns-api-data>
                </small>
                <small>
                    <ns-api-data field="$id$.topics.$topic$.last_message.date_inserted"
                                 class="ns-template-var-attr"></ns-api-data>
                </small>
            </div>
        </div>
    </template>
</section>`
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
            if (this.dataBlock.dataLoad) this.setupCategoryContainer();
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
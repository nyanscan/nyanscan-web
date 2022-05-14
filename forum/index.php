<?php
$title = 'Forum | NyanScan';
$css = ["forum.css"];
include($_SERVER['DOCUMENT_ROOT'] . '/private/components/nav.php');
?>
<section>
    <ns-api-data-block id="category-container-data" href="forum/category/root">

        <div id="category-container" class="d-flex flex-column gap-5">

        </div>
    </ns-api-data-block>
    <template id="category-template">
        <div>
            <div>
                <h3>
                    <ns-api-data field="$id$.name" class="ns-template-var-attr"></ns-api-data>
                </h3>
                <p>
                    <ns-api-data field="$id$.description" class="ns-template-var-attr"></ns-api-data>
                </p>
            </div>
            <div class="ns-category-topic-container">

            </div>
        </div>
    </template>
    <template id="category-template-topic">
        <div>
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
</section>
<?php
$scripts = ["forum.js"];
include($_SERVER['DOCUMENT_ROOT'] . '/private/components/foot.php');
?>

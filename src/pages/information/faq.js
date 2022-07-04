export default class extends Pages {
    title = "Page CGU | NyanScan"

    get raw() {
        return `
    <section class="ns-background-image-cgu">
        <div class="ns-scan-CGU">
            <div class="text-center"><h1 class="ns-fs-1">FAQ</h1></div>
            
        </div>
    </section>
      `;
    }

    constructor(app) {
        super(app);
    }

}

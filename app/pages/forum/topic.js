export default class extends Pages {


    get raw() {
        return `
<section>

</section>
        `
    }

    constructor(app) {
        super(app);
    }

    getHTML(vars) {
        return JSON.stringify(vars, null, '\t');
    }

    build(parent, vars) {
        super.build(parent, vars);

    }

}
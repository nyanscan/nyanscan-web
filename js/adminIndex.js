class Footer extends Component {

    build(parent) {}
    constructor(app) {
        super(app, COMPONENT_TYPE_FOOTER);
    }
}

class Header extends Component {
    get raw() {
        return ``;
    }

    getHTML() {
        return super.getHTML();
    }

    build(parent) {
        super.build(parent);
    }

    constructor(app) {
        super(app, COMPONENT_TYPE_FOOTER);
    }

}

class Index extends Pages {

    get raw() {
        return `
<section class="indexS">
    <ns-api-data-block class="part-container" href="admin/stats">
        <div class="box">
            <span></span>
            <ns-a class="content" href="project">
                <i class="bi bi-book"></i>
                <ns-api-data field="project">0</ns-api-data>
                <h3>Projet</h3>
            </ns-a>
        </div>
        <div class="box" style="--color-one: #70ad4c; --color-two: #65d11d">
            <span></span>
            <ns-a class="content" href="device">
                <i class="bi bi-image"></i>
                <ns-api-data field="picture">0</ns-api-data>
                <h3>Image</h3>
            </ns-a>
        </div>
        <div class="box" style="--color-one: #4C6CAD; --color-two: #1D59D1">
            <span></span>
            <ns-a class="content">
                <i class="bi bi-person"></i>
                <ns-api-data field="user">0</ns-api-data>
                <h3>Utilisateurs</h3>
            </ns-a>
        </div>
    </ns-api-data-block>
</section>
        `;
    }

    build(parent, vars) {
        super.build(parent, vars);
    }

    constructor(app) {
        super(app, false, false);
    }
}

const STRUCTURE = [
    {
        re: /^(|index|home)$/,
        rel: "index"
    },
    {
        re: '^project$',
        rel: "admin/project"
    }
]

export const APP = new Application(Header, Footer, Index, Error404, STRUCTURE, 'admin');
window.APP = APP;
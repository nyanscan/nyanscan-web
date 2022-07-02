export default class extends Pages {

    title = 'NyanScan';
    search;

    get raw() {
        return `
        <section>
            <div class="ns-categ-center">
                <h2 class="ns-text-red fw-bold ns-fs-2">Résultats de recherche pour ${escapeHtml(this.search)}</h2>
            </div>
            <div class="ns-center d-flex">
                <hr class="ns-line">
            </div>
            <div id="ns-search-res-members" class="ns-search-res-category">
                <h2 class="ns-fs-2">Membres</h2>
                <div class="ns-search-res-container">
                    <ns-project></ns-project><ns-project></ns-project><ns-project></ns-project><ns-project></ns-project><ns-project></ns-project>
                </div>
            </div>
            <div id="ns-search-res-project" class="ns-search-res-category">
                <h2 class="ns-fs-2">Projets</h2>
                <div class="ns-search-res-container">
                    <ns-project></ns-project><ns-project></ns-project><ns-project></ns-project><ns-project></ns-project><ns-project></ns-project>
                </div>
            </div>
            <div id="ns-search-res-volumes" class="ns-search-res-category">
                <h2 class="ns-fs-2">Tomes</h2>
                <div class="ns-search-res-container">
                </div>
            </div>
            <div id="ns-search-res-empty" style="display: none">
                <div class="ns-success-css mb-5">
                    <div class="ns-center">
                        <div class="ns-scan-failed align-items-center">
                            <p class="ns-fs-4 m-0 text-center">Aucun résultats trouvé malheureusement ;(</p>
                        </div>
                    </div>
                </div>
                <div class="mx-3 pb-5">
                    <img src="/res/failed.png" class="img-fluid mx-auto d-block" width="400" alt="image fail">
                </div>
            </div>      
        </section>
        `;
    }

    constructor(app) {
        super(app);
    }

    build(parent, vars) {
        this.search = decodeURI(vars.search);
        super.build(parent, vars);
        this.app.header.searchInput.value = this.search;
        this.title = `Résultats : ${this.search} | NyanScan`;
        sendApiGetFetch('search?v=' + vars.search).then(this.searchResult.bind(this));
    }

    createUser(data, container) {
        let div = create('div', null, container, 'ns-search-res-user');
        createPromise('ns-a', null, div).then( a => {
            a.href = `/u/${data.id}`;
            createPromise('img', null, a, 'ns-avatar').then(img => {
                img.src = '/res/profile.webp';
            })
        })
        createPromise('span', null, div).then(name => name.innerText = data.username);
    }

    searchResult(data) {
        const memberDiv = _('#ns-search-res-members');
        const projectDiv = _('#ns-search-res-project');
        const volumeDiv = _('#ns-search-res-volumes');
        if (data.user.length > 0) {
            let container = memberDiv.getElementsByClassName('ns-search-res-container')[0];
            container.innerHTML = '';
            data.user.forEach(user => this.createUser(user, container));
        } else memberDiv.style.display = 'none';

        if (data.project.length > 0) {
            let container = projectDiv.getElementsByClassName('ns-search-res-container')[0];
            container.innerHTML = data.project.map(project => `<ns-project ns-title="${project.title}" ns-id="${project.id}" ns-picture="${project.picture}"></ns-project>`).join('');
        } else projectDiv.style.display = 'none';

        if (data.volume.length > 0) {
            let container = volumeDiv.getElementsByClassName('ns-search-res-container')[0];
            container.innerHTML = data.volume.map(project => `<ns-project ns-title="${project.title}" ns-id="${project.project}/${project.volume}" ns-picture="${project.picture}"></ns-project>`).join('');
        } else volumeDiv.style.display = 'none';


        if (data.project.length + data.user.length + data.volume.length === 0) {
            _('#ns-search-res-empty').style.display = '';
        }
    }

    destroy() {
        super.destroy();
        this.app.header.searchInput.value = '';
    }

}
export default class extends Pages {

    getHTML(vars) {
        return JSON.stringify(vars, null, '\t');
    }

    constructor(app) {
        super(app);
    }
}
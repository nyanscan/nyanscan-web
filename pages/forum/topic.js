class ForumMessage extends Component {

    id;
    page;
    data;
    mainDiv;
    haveReply = true;
    isShort = true;
    isLoading = false;
    totalMessage = 0;
    next;
    first;
    moreBtn;
    lessBtn;
    replyContainer;
    replyBlock;
    placeHolder;
    currentReplyId = null;

    set loading(v) {
        this.isLoading = v;
        if (v)
            this.placeHolder.style.display = '';
        else this.placeHolder.style.display = 'none';
    }

    get raw() {
        return `
            <ns-a href="/u/${this.data['author']?.['id']}" class="nsf-message-user">
                <img class="ns-avatar ns-avatar-md" src="/res/profile.webp">
                <span class="nsf-message-username">${this.data['author']?.['username']}</span>  
            </ns-a>
            <div class="nsf-message-date">
                <span>Le ${this.data['date_inserted']}</span>
                <button class="btn ns-tickle-pink-btn ns-btn-sm ns-hide-disconnected nsf-message-reply-btn"><i class="bi bi-reply-fill"></i></button>
            </div>
            <p class="nsf-message-content">${escapeHtml(this.data.content)}</p>
            <div class="nsf-message-reply nsf-message-reply-hide">
                <button class="nsf-message-reply-less">Afficher moins de réponses</button>
                <div class="nsf-message-reply-container"></div>
                <div class="ns-placeholder" style="height: 50vh; background-color: var(--ns-color-deep-mauve); display: none"></div>
                <button class="nsf-message-reply-more">Afficher plus de réponses ( ${this.data['reply_count']} )</button>
            </div>
        `;
    }

    getHTML() {
        const e = create('div', null, null, 'nsf-message', 'ns-text-white');
        e.innerHTML = this.raw;
        return e;
    }

    constructor(page, app, id, data) {
        super(app, COMPONENT_TYPE_FLOAT);
        this.page = page;
        this.id = id;
        this.data = data;
    }

    build(parent) {
        this.mainDiv = this.getHTML();
        parent.appendChild(this.mainDiv);
        if (isNaN(this.data["reply_count"]) || this.data["reply_count"] <= 0)
        {
            this.haveReply = false;
            this.mainDiv.querySelectorAll('.nsf-message-reply').forEach(e => e.remove());
        } else {
            this.next = `forum/message/${this.data['id']}/reply?offset=0&limit=10`;
            this.first = this.next;
            this.replyBlock = this.mainDiv.querySelector('.nsf-message-reply');
            this.replyContainer = this.replyBlock.querySelector('.nsf-message-reply-container');
            this.lessBtn = this.replyBlock.querySelector('.nsf-message-reply-less');
            this.moreBtn = this.replyBlock.querySelector('.nsf-message-reply-more');
            this.placeHolder = this.replyBlock.querySelector('.ns-placeholder');
            this.moreBtn.addEventListener('click', this.moreReply.bind(this));
            this.lessBtn.addEventListener('click', this.lessReply.bind(this));
        }
        const replyBtn = this.mainDiv.querySelector('.nsf-message-reply-btn');
        if (replyBtn) replyBtn.addEventListener('click', this.newReplyClick.bind(this), true);
    }

    newReplyClick(e) {
        e.preventDefault();
        console.log(e);
        if (this.app.user.isLog)
            this.page.createReply(this.data['id'], this.data['content']);
    }

    createReplyHtml(data) {
        const block = create('div', null, this.replyContainer, 'nsf-message', 'ns-text-white');
        block.innerHTML = `
             <ns-a href="/u/${data['author']?.['id']}" class="nsf-message-user">
                <img class="ns-avatar ns-avatar-md" src="/res/profile.webp">
                <span class="nsf-message-username">${data['author']?.['username']}</span>  
            </ns-a>
            <div class="nsf-message-date">
                <span>Le ${data['date_inserted']}</span>
            </div>
            <p class="nsf-message-content">${escapeHtml(data.content)}</p>
        `;
    }

    moreReply(e) {
        e.preventDefault();
        if (!this.haveReply || this.isLoading || this.next === null) return;
        if (this.isShort) {
            this.isShort = false;
            if (this.replyBlock.classList.contains('nsf-message-reply-hide')) this.replyBlock.classList.remove('nsf-message-reply-hide');
        }
        this.loading = true;
        sendApiGetFetch(this.next).then(data => {
            if (data['elements']) {
                data['elements'].forEach(e => {
                    this.createReplyHtml(e);
                })
            }
            this.next = data['next'] ? data['next'] : null;
            if (this.next === null) this.moreBtn.style.display = 'none';

        }).catch(console.error).finally(() => this.loading = false);
    }



    lessReply(e) {
        e.preventDefault();
        if (!this.haveReply || this.isShort || this.isLoading) return;
        this.isShort = true;
        if (!this.replyBlock.classList.contains('nsf-message-reply-hide')) this.replyBlock.classList.add('nsf-message-reply-hide');
        if (this.next === null) this.moreBtn.style.display = '';
        this.next = this.first;
        this.replyContainer.innerHTML = '';
    }

}

export default class extends Pages {

    firstLoad = true;
    topic = 0;
    countPerPage = 10;
    dataBlock;
    messages = [];
    sendMessageBtn;
    sendMessageArea;
    sendMessageError;
    sendMessageReply;
    sendMessageReplyShort;

    set showError(v) {
        if (v) {
            this.sendMessageError.style.display = '';
            this.sendMessageError.innerText = v;
        }
        else this.sendMessageError.style.display = 'none';
    }

    set page(v) {
        this.dataBlock.href = `forum/messages?topic=${this.topic}&offset=${this.countPerPage * v}&limit=${this.countPerPage}`;
    }

    set maxPage(v) {
        this.pageTop.max = v;
        if (v <= 1) {
            this.pageTop.disabled = true;
            this.pageTop.style.display = 'none';
        }
    }

    get raw() {
        return `
        <section>
            <ns-api-data-block id="nsf-messages-container-data">
                <div class="ns-categ-center">
                    <div class="p-4 justify-content-start">
                        <h2 class="ns-text-red fw-bold ns-fs-1"><ns-api-data field="topic.name" class="ns-empty-placeholder"></ns-api-data></h2>
                        <div class="d-flex flex-row align-items-center gap-3">
                            <p class="ns-tickle-pink-bg ns-rounded-text d-inline-flex">Nombre total de postes :&nbsp;<span id="ns-topic-total" class="d-inline-block ns-empty-placeholder"></span></p>
                        </div>
                    </div>
                </div>
                <div class="ns-center d-flex">
                    <hr class="ns-line">
                </div>
                <div class="ns-center">
                    <ns-pagination id="ns-topic-page-top" min="1" value="1" max-show="5"></ns-pagination>
                </div>
                <div id="nsf-messages-container" class="d-flex flex-column ns-categ-center ns-empty-placeholder"></div>
                <div class="ns-center mb-5">
                    <ns-a href="/forum" class="btn ns-tickle-pink-btn">Retourner à la liste des catégories</ns-a>
                </div>
                <div id="nsf-message-compose" class="ns-hide-disconnected">
                    <div id="nsf-message-compose-reply">
                        <div><span>Reply to </span><span id="nsf-message-compose-reply-short"></span></div>
                        <button><i class="bi bi-x-circle"></i></button>
                    </div>
                    <textarea id="nsf-message-compose-area" name="message"></textarea>
                    <span id="nsf-message-compose-error">Message trop long ou vide</span>
                    <button id="nsf-message-compose-send" type="button">Envoyer</button>
                </div>
            </ns-api-data-block>
        </section>
        `
    }

    constructor(app) {
        super(app);
    }

    build(parent, vars) {
        super.build(parent, vars);
        this.dataBlock = _('#nsf-messages-container-data');
        if (!this.dataBlock || vars["topic"]===undefined || !isInt(vars["topic"])) this.app.do404();
        else {
            this.dataBlock.addEventListener('dataLoad', this.setupMessages.bind(this));
            this.topic = vars["topic"];
            this.page = vars['page']||0;
            this.pageTop = _('#ns-topic-page-top');
            this.pageTop.addEventListener('change', this.changePage.bind(this));
        }
        this.sendMessageBtn = _('#nsf-message-compose-send');
        this.sendMessageArea = _('#nsf-message-compose-area');
        this.sendMessageError = _('#nsf-message-compose-error');
        this.sendMessageReply = _('#nsf-message-compose-reply');
        this.sendMessageReply.style.display = 'none';
        this.sendMessageReplyShort = _('#nsf-message-compose-reply-short');
        this.sendMessageReply.querySelector('button').addEventListener('click', this.removeReply.bind(this));

        this.sendMessageBtn.addEventListener('click', this.sendMessage.bind(this));
        this.showError = false;
    }

    changePage(e) {
        this.page = e.detail.value - 1;
    }

    setupMessages() {
        if (this.dataBlock.isError) {
            if (this.dataBlock.error.code > 0) {
                this.app.do404();
            }else {
                this.app.fatalError();
            }
        } else {
            const raw = this.dataBlock.rawData;
            if (raw.elements.length === 0) {
                this.app.do404();
                return;
            }
            if (this.firstLoad) {
                this.firstLoad = false;
                this.amount = raw["count"];
                this.maxPage = Math.ceil(this.amount / this.countPerPage);
                _('#ns-topic-total').innerText = this.amount;
            }

            const container = _("#nsf-messages-container");
            container.innerHTML = '';
            this.messages.forEach(m => m.destroy());
            this.messages =[];
            for (const id in raw['elements']) {
                const current = raw["elements"][id];
                const msg = new ForumMessage(this, this.app, id, current);
                this.messages[id] = msg;
                msg.build(container);
            }
        }
    }

    createReply(id, content) {
        console.log(id, content.length);
        if (content.length > 30) {
            content = content.substring(0, 27);
            content += '...';
        }
        this.sendMessageReplyShort.innerText = escapeHtml(content);
        this.sendMessageReply.style.display = '';
        this.currentReplyId = id;
        this.sendMessageReply.scrollIntoView();
    }

    removeReply() {
        this.sendMessageReplyShort.innerText = '';
        this.sendMessageReply.style.display = 'none';
        this.currentReplyId = null;
    }

    sendMessage() {
        const msg = this.sendMessageArea.value;
        if (msg.length < 1 ) {
            return;
        }
        if (msg.length > 2000) {
            this.showError = 'Le $message doit contenir au minimum 1 caractére et au maximum 2000 !';
            return;
        }
        const fd = new FormData();
        fd.set('message', msg)
        let url;
        if (this.currentReplyId === null) {
            url = 'forum/message';
            fd.set('topic', this.topic.toString());
        } else {
            url = 'forum/reply';
            fd.set('reply', this.currentReplyId.toString());
        }

        sendApiPostFetch(url, fd).then(data => {
            this.showError = false;
            this.sendMessageArea.value = '';
            if (this.currentReplyId) {
                this.removeReply();
            }
            this.dataBlock.refresh();
        }).catch(r => {
            if (r?.status === 400) this.showError = 'Le $message doit contenir au minimum 1 caractére et au maximum 2000 !';
            else {
                this.showError = 'Une erreur est survenue merci de ressayer plus tard'
            }
        }).finally();
    }

}
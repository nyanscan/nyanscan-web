class ModalDeleteMessage extends Component {

    id;
    isReply;

    get raw() {
        return `
        <form id="nsf-modal-delete-message">
        <h3>Suprimer un message ?</h3>
        <div class="ns-form-group d-flex flex-column gap-2">
            <p>Voulez-vous vraiment supprimer le message .</p>
        </div>
        <div class="mt-3 ns-modal-btn-container">
            <button type="button" class="ns-modal-cancel-btn bg-secondary">Annuler</button>
            <button type="submit" class="ns-tickle-pink-bg">Supprimer</button>
        </div>
        </form>
        `;
    }
    build(parent) {
        super.build(parent);
        _('#nsf-modal-delete-message').addEventListener('submit', this.sendRequest.bind(this));
    }

    constructor(app, id, isReply) {
        super(app, COMPONENT_TYPE_MODAL);
        this.id = id;
        this.isReply = isReply;
    }

    sendRequest(event) {
        event.preventDefault();
        loadingScreen(true);
        this.app.closeModal();
        sendApiDeleteFetch(`forum/${this.isReply ? 'reply' : 'message'}/${this.id}`).then(d => this.app.reload()).catch(console.error).finally(() => loadingScreen(false));
    }

}

class ForumMessage extends Component {

    id;
    page;
    data;
    mainDiv;
    haveReply = true;
    isShort = true;
    isLoading = false;
    isEdit = false;
    next;
    first;
    moreBtn;
    lessBtn;
    replyContainer;
    replyBlock;
    placeHolder;
    isAuthor;
    avatar;

    set loading(v) {
        this.isLoading = v;
        if (v)
            this.placeHolder.style.display = '';
        else this.placeHolder.style.display = 'none';
    }

    get raw() {
        return `
            <ns-a href="/u/${this.data['author']?.['username']}" class="nsf-message-user">
                <img class="ns-avatar ns-avatar-md" src="${this.avatar}">
                <span class="nsf-message-username">${this.data['author']?.['username']}</span>  
            </ns-a>
            <div class="nsf-message-date">
                <span>Le ${this.data['date_inserted']} ${this.isEdit ? '(modifié)' : ''}</span>
            </div>
             <div class="btn-group nsf-message-action" role="group">
                    <button class="btn ns-tickle-pink-btn ns-btn-sm ns-hide-disconnected nsf-message-reply-btn"><i class="bi bi-reply-fill"></i></button>
                    <button class="btn ns-tickle-pink-btn ns-btn-sm nsf-message-edit-btn"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn ns-tickle-pink-btn ns-btn-sm nsf-message-delete-btn"><i class="bi bi-trash-fill"></i></button>
                </div>
            <p class="nsf-message-content">${formatMessage(this.data.content)}</p>
            <div class="nsf-message-reply nsf-message-reply-hide">
                <button class="nsf-message-reply-less btn ns-tickle-pink-btn btn-sm">Afficher moins de réponses</button>
                <div class="nsf-message-reply-container"></div>
                <div class="ns-placeholder" style="height: 50vh; background-color: var(--ns-color-deep-mauve); display: none"></div>
                <button class="nsf-message-reply-more btn ns-tickle-pink-btn btn-sm">Afficher plus de réponses ( ${this.data['reply_count']} )</button>
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
        this.isEdit = this.data['status'] && (parseInt(this.data['status']) & 1);
        this.isAuthor = this.app.user.isLog && this.app.user.id.toString() === this.data['author']['id'];
        this.avatar = this.data['author']['avatar'] ? image_id_to_path(this.data['author']['avatar']) : '/res/profile.webp';
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
        const editBtn = this.mainDiv.querySelector('.nsf-message-edit-btn');
        const deleteBtn = this.mainDiv.querySelector('.nsf-message-delete-btn');
        if (editBtn) {
            if (this.isAuthor) {
                editBtn.addEventListener('click', this.newEditClick.bind(this, this.data['id'], this.data['content'], false), true);
            } else editBtn.remove();
        }
        if (deleteBtn) {
            console.log(this.app.user.permissionLevel);
            if (this.isAuthor || this.app.user.permissionLevel >= 200) {
                deleteBtn.addEventListener('click', this.newDeleteClick.bind(this, this.data['id'], false), true);
            } else deleteBtn.remove();
        }
        if (replyBtn) replyBtn.addEventListener('click', this.newReplyClick.bind(this), true);
    }

    newDeleteClick(id, isReply, e) {
        e.preventDefault();
        if (this.isAuthor || this.app.user.permissionLevel >= 200) {
            this.page.createDelete(id, isReply);
        }
    }

    newEditClick(id, content, isReply, e) {
        e.preventDefault();
        if (this.isAuthor) {
            this.page.createEdit(id, content, isReply);
        }
    }

    newReplyClick(e) {
        e.preventDefault();
        if (this.app.user.isLog)
            this.page.createReply(this.data['id'], this.data['content']);
    }

    createReplyHtml(data) {
        const block = create('div', null, this.replyContainer, 'nsf-message', 'ns-text-white');
        let isEdit = this.data['status'] && (parseInt(this.data['status']) & 1);
        let isAuthor = this.app.user.isLog && this.app.user.id.toString() === data['author']['id'];
        block.innerHTML = `
             <ns-a href="/u/${data['author']?.['username']}" class="nsf-message-user">
                <img class="ns-avatar ns-avatar-md" src="/res/profile.webp">
                <span class="nsf-message-username">${data['author']?.['username']}</span>  
            </ns-a>
            <div class="nsf-message-date">
                <span>Le ${data['date_inserted']} ${isEdit ? '(modifié)' : ''}</span>
            </div>
            <div class="btn-group nsf-message-action" role="group">
                    <button class="btn ns-tickle-pink-btn ns-btn-sm nsf-message-edit-btn"><i class="bi bi-pencil-fill"></i></button>
                    <button class="btn ns-tickle-pink-btn ns-btn-sm nsf-message-delete-btn"><i class="bi bi-trash-fill"></i></button>
                </div>
            <p class="nsf-message-content">${formatMessage(data.content)}</p>
        `;
        let editBtn = block.querySelector('.nsf-message-edit-btn');
        let deleteBtn = block.querySelector('.nsf-message-delete-btn');
        if (editBtn) {
            if (isAuthor)
                editBtn.addEventListener('click', this.newEditClick.bind(this, data['id'], data['content'], true), true);
            else editBtn.remove();
        }
        if (deleteBtn) {
            if (isAuthor || this.app.user.permissionLevel >= 200) {
                deleteBtn.addEventListener('click', this.newDeleteClick.bind(this, data['id'], true), true);
            } else deleteBtn.remove();
        }
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

const COMPOSE_TYPE_SEND = 0;
const COMPOSE_TYPE_EDIT = 1;
const COMPOSE_TYPE_EDIT_REPLY = 2;
const COMPOSE_TYPE_REPLY = 3;

export default class extends Pages {

    lengthError = 'Le message doit contenir au minimum 1 caractére et au maximum 2000 !';

    firstLoad = true;
    topic = 0;
    countPerPage = 10;
    dataBlock;
    messages = [];

    currentComposeID = null;
    composeType = COMPOSE_TYPE_SEND;

    sendMessageBtn;
    sendMessageArea;
    sendMessageError;

    sendMessagePop;
    sendMessagePopText;

    set showError(v) {
        if (v) {
            this.sendMessageError.style.display = '';
            this.sendMessageError.innerText = v;
        }
        else this.sendMessageError.style.display = 'none';
    }

    get isError() {
        return this.sendMessageError.style.display !== 'none';
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
                            <p class="ns-tickle-pink-bg ns-rounded-text">Nombre de postes :&nbsp;<span id="ns-topic-total" class="d-inline-block ns-empty-placeholder"></span></p>
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
                <div class="ns-categ-center">
                    <ns-a href="/forum" class="btn ns-tickle-pink-btn">Retourner à la liste des catégories</ns-a>
                </div>
                <div id="nsf-message-compose" class="ns-hide-disconnected ns-categ-center ns-text-white">
                    <div id="nsf-message-compose-pop">
                        <div id="nsf-message-compose-pop-text"></div>
                        <button><i class="bi bi-x-circle-fill"></i></button>
                    </div>
                    <div id="sf-message-compose-area-container">
                        <span id="nsf-message-compose-error"></span>
                        <textarea id="nsf-message-compose-area" name="message" placeholder="Envoyer un message" rows="1"></textarea>
                        <button id="nsf-message-compose-send" type="button" title="Envoyre" aria-label="send"><i class="bi bi-send-fill"></i></button>
                    </div>
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
        this.sendMessageArea.addEventListener('input', this.updateComposeAreaSize.bind(this));
        this.sendMessageError = _('#nsf-message-compose-error');
        this.sendMessagePop = _('#nsf-message-compose-pop');
        this.sendMessagePop.style.display = 'none';
        this.sendMessagePopText = _('#nsf-message-compose-pop-text');
        this.sendMessagePop.querySelector('button').addEventListener('click', this.resetComposeStatus.bind(this));

        this.sendMessageBtn.addEventListener('click', this.sendMessage.bind(this));
        this.showError = false;
    }

    updateComposeAreaSize() {
        this.sendMessageArea.style.height = 'auto';
        this.sendMessageArea.style.height = Math.max(32, Math.min(176, this.sendMessageArea.scrollHeight)) + 'px';
        if (this.sendMessageArea.value.length > 2000) {
            if (!this.isError) this.showError = this.lengthError;
        } else {
            if (this.isError) this.showError = false;
        }
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

    enableComposePop(id) {
        this.sendMessagePop.style.display = '';
        this.currentComposeID = id;
        this.sendMessagePop.scrollIntoView();
        this.sendMessageArea.focus({preventScroll:true});
    }

    createDelete(id, isReply) {
        this.app.openModal(new ModalDeleteMessage(this.app, id, isReply));
    }

    createReply(id, content) {
        if (content.length > 40) {
            content = content.substring(0, 37);
            content += '...';
        }
        content = content.replace(/[\r\n]/g, ' ');
        this.sendMessagePopText.innerHTML = `<span class="ns-text-light-gray">Répondre à </span><span>${escapeHtml(content)}</span>`;
        if (this.composeType === COMPOSE_TYPE_EDIT || this.composeType === COMPOSE_TYPE_EDIT_REPLY) {
            this.sendMessageArea.value = '';
            this.updateComposeAreaSize();
        }
        this.composeType = COMPOSE_TYPE_REPLY;
        this.enableComposePop(id);
    }

    createEdit(id, content, isReply) {
        this.sendMessagePopText.innerHTML = `Modifier votre message`;
        this.sendMessageArea.value = content;
        this.updateComposeAreaSize();
        this.composeType = isReply ? COMPOSE_TYPE_EDIT_REPLY : COMPOSE_TYPE_EDIT;
        this.enableComposePop(id);
    }

    resetComposeStatus() {
        this.sendMessagePopText.innerText = '';
        this.sendMessagePop.style.display = 'none';
        this.currentComposeID = null;
        if (this.composeType === COMPOSE_TYPE_EDIT || this.composeType === COMPOSE_TYPE_EDIT_REPLY) {
            this.sendMessageArea.value = '';
            this.updateComposeAreaSize();
        }
        this.composeType = COMPOSE_TYPE_SEND;
    }

    sendMessage() {
        const msg = this.sendMessageArea.value;
        if (msg.length < 1 ) {
            return;
        }
        if (msg.length > 2000) {
            return;
        }
        const fd = new FormData();
        fd.set('message', msg)
        let url;
        switch (this.composeType) {

            case COMPOSE_TYPE_SEND:
                url = 'forum/message';
                fd.set('topic', this.topic.toString());
                break
            case COMPOSE_TYPE_REPLY:
                url = 'forum/reply';
                fd.set('reply', this.currentComposeID.toString());
                break;
            case COMPOSE_TYPE_EDIT:
                url = 'forum/edit/message';
                fd.set('ref', this.currentComposeID.toString());
                break;
            case COMPOSE_TYPE_EDIT_REPLY:
                url = 'forum/edit/reply';
                fd.set('ref', this.currentComposeID.toString());
                break;
            default:
                this.composeType = COMPOSE_TYPE_SEND;
                this.showError = 'Une erreur est survenue merci de ressayer';
                return;
        }

        sendApiPostFetch(url, fd).then(data => {
            this.showError = false;
            this.sendMessageArea.value = '';
            this.resetComposeStatus();
            this.dataBlock.refresh();
        }).catch(r => {
            if (r?.status === 400) this.showError = this.lengthError;
            else {
                this.showError = 'Une erreur est survenue merci de ressayer plus tard';
            }
        }).finally();
    }

}
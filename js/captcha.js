function validateCord(pos, captchaWidth, captchaHeight, ceilSize, pieceSize, isx = true) {
    return Math.min(isx ? (captchaWidth - ceilSize) : (captchaHeight + ceilSize + pieceSize), Math.max(0, Math.floor(pos / ceilSize) * ceilSize));
}

function newStringCord(old="", index=0, x=0, y=0) {
    if (!old) old = '0';
    let split = old.split(':');
    while (split.length < index * 2 + 1) {
        split.push('0');
    }
    split[index * 2] = `${x}`;
    split[index * 2 + 1] = `${y}`;
    return split.join(':');
}

function setup_captcha(captcha) {

    // GET var
    const numberPiece = window.getComputedStyle(captcha).getPropertyValue('--ns-captcha-piece-count');
    const pieceSize = window.getComputedStyle(captcha).getPropertyValue('--ns-captcha-piece-size').split('px')[0] * 1;
    const ceilSize = window.getComputedStyle(captcha).getPropertyValue('--ns-captcha-ceil-size').split('px')[0] * 1;
    const captchaHeight = window.getComputedStyle(captcha).getPropertyValue('--ns-captcha-height').split('px')[0] * 1;
    const captchaWidth = window.getComputedStyle(captcha).getPropertyValue('--ns-captcha-width').split('px')[0] * 1;

    console.log(numberPiece, pieceSize, ceilSize, captchaHeight, captchaWidth);

    let currentPiece;

    for (let i = 0; i < numberPiece; i++) {
        currentPiece = captcha.getElementsByClassName("captcha-piece")[i];
        currentPiece.style.top = `${captchaHeight + ceilSize}px`;
        currentPiece.style.left = (ceilSize + (pieceSize + ceilSize) * i) + 'px';
        currentPiece.pieceCont = i;

        currentPiece.firstElementChild.style.marginTop = '-10px';
        currentPiece.firstElementChild.style.marginLeft = '-' + ((captchaWidth + (ceilSize * 2 + pieceSize) * i) + ceilSize) + 'px';
        // remove image drag
        currentPiece.firstElementChild.ondragstart = () => {
            return false;
        };
    }

    const input = captcha.getElementsByClassName("captcha-input")[0];

    function move(e) {
        if (!e.target.parentElement || !e.target.parentElement.classList.contains('captcha-piece')) {
            return;
        }
        const target = e.target.parentElement;
        target.moving = true;
        if (e.clientX) {
            target.oldX = e.clientX; // If they exist then use Mouse input
            target.oldY = e.clientY;
        } else {
            target.oldX = e.touches[0].clientX; // Otherwise use touch input
            target.oldY = e.touches[0].clientY;
        }

        target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
        target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;


        function endDrag() {
            target.moving = false;
        }

        function dr(ev) {
            ev.preventDefault();
            if (!target.moving) {
                return;
            }
            if (ev.clientX) {
                target.distX = ev.clientX - target.oldX;
                target.distY = ev.clientY - target.oldY;
            } else {
                target.distX = ev.touches[0].clientX - target.oldX;
                target.distY = ev.touches[0].clientY - target.oldY;
            }
            let x = validateCord(target.oldLeft + target.distX, captchaWidth, captchaHeight, ceilSize, pieceSize);
            let y = validateCord(target.oldTop + target.distY, captchaWidth, captchaHeight, ceilSize, pieceSize,false);
            target.style.left = x + "px";
            target.style.top = y + "px";

            input.value = newStringCord(input.value, target.pieceCont, x, y);

        }
        document.onmouseup = endDrag;
        document.ontouchend = endDrag;
        document.onmousemove = dr;
        document.ontouchmove = dr;
    }
    document.onmousedown = move;
    document.ontouchstart = move;
}

const cap = document.getElementById('captcha');
const main_image = document.getElementById('captcha-img');

const load = document.getElementById("captcha-load");

if (main_image.complete) {
    if (main_image.naturalWidth === 0) {
        document.getElementById("captcha-error").style.display = 'flex';
    }
    else setup_captcha(cap, main_image);
}
else {
    load.style.display = 'flex';
    main_image.addEventListener('load', ev => {
        load.style.display = 'none';
        setup_captcha(cap, main_image);
    });
    main_image.addEventListener('error', function () {
        load.style.display = 'none';
        document.getElementById("captcha-error").style.display = 'flex';
    })
}


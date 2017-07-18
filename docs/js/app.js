const $document = $(document);
let isScrolling = false;

function setActiveNavLinks() {
    const scroll = $document.scrollTop();
    let currentEl = $('.c-section')[0];
    $.each(document.querySelectorAll('.c-section'), (i, el) => {
        const $el = $(el);
        const top = $el.position().top;
        const buffer = $(window).height() * 0.25;
        $el.blur();
        document.querySelector(`[href="#${el.id}"]`).classList.remove('active');
        if (scroll + buffer >= top) {
            currentEl = el;
        } else {
            return false;
        }

        return true;
    });
    document.querySelector(`[href="#${currentEl.id}"]`).classList.add('active');
}

function alignTop() {
    const $top = $('#top');
    const scroll = $document.scrollTop();
    const height = $top.height();
    const padding = $(window).width() >= 1300 ? -100 : -45;

    // Only perform the update if still in the viewport
    if (scroll < height) {
        const $daveAndDrew = $('#dave-and-drew');
        const dHeight = $daveAndDrew.height() * 3;
        const offset = Math.round(scroll / 3) + padding;
        const opacity = (dHeight - scroll) / dHeight;
        const backgroundPosition = `0 ${offset}px`;
        $top.css({ backgroundPosition });
        $daveAndDrew.css({ opacity });
    }
}

/*
function alignProposal() {
    const scroll = $document.scrollTop();
    const $proposal = $('#proposal');
    const top = $proposal.position().top;
    const height = $proposal.height();
    const wHeight = $(window).height();
    let backgroundPosition;
    let delta;

    if (scroll + wHeight < top) {
        backgroundPosition = '50% 80%';
    } else if (scroll < top + height) {
        delta = ((top - (scroll + wHeight)) / (wHeight + height)) * 60;
        backgroundPosition = `50% ${70 + delta}%`;
    } else {
        backgroundPosition = '50% 20%';
    }

    $proposal.css({ backgroundPosition });
}
*/

function setupParallax() {
    // None on mobile
    if ($(window).width() < 1024) {
        return;
    }

    $document.scroll(() =>
        window.requestAnimationFrame(() => {
            alignTop();

            if (!isScrolling) {
                setActiveNavLinks();
            }
        }));

    alignTop();
    setActiveNavLinks();
}

function setupNavScroll() {
    /* eslint-disable no-new */
    new SweetScroll({
        updateURL: true,
        stopPropagation: false,

        beforeScroll: () => { isScrolling = true; },
        completeScroll: () => { isScrolling = false; },
    });
    /* eslint-enable no-new */
}

function setupLinkClicks() {
    $('.c-nav__link').click((e) => {
        document.querySelectorAll('.c-nav__link').forEach(el =>
            el.classList.remove('active'));
        $(e.currentTarget).addClass('active');
    });
}

function onReady() {
    setupParallax();
    setupNavScroll();
    setupLinkClicks();
}

$document.ready(onReady);

const $document = $(document);
let isScrolling = false;

function setActiveNavLinks() {
    const scroll = $document.scrollTop();
    let currentEl = $('.c-section')[0];
    document.querySelectorAll('.c-section').forEach((el) => {
        const $el = $(el);
        const top = $el.position().top;
        const buffer = $(window).height() * 0.25;
        $el.blur();
        document.querySelector(`[href="#${el.id}"]`).classList.remove('active');
        if (scroll + buffer >= top) {
            currentEl = el;
        }
    });
    document.querySelector(`[href="#${currentEl.id}"]`).classList.add('active');
}

function alignTop() {
    const $top = $('#top');
    const $daveAndDrew = $('#dave-and-drew');
    const scroll = $document.scrollTop();
    const offset = Math.round(scroll / 2);
    const height = $top.height();
    const opacity = (height - scroll) / height;
    const backgroundPosition = `0 ${offset}px`;
    $top.css({ backgroundPosition });
    $daveAndDrew.css({ opacity });
}

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

function setupParallax() {
    $document.scroll(() => {
        alignTop();
        alignProposal();

        if (!isScrolling) {
            setActiveNavLinks();
        }
    });
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
    setActiveNavLinks();
    alignTop();
    alignProposal();
}

$document.ready(onReady);

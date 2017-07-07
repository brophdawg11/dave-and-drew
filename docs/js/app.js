const $document = $(document);

function setupParallax() {
    $document.scroll(() => {
        const $top = $('#top');
        const $daveAndDrew = $('#dave-and-drew');
        const scroll = $document.scrollTop();
        const offset = Math.round(scroll / 2);
        const height = $top.height();
        const opacity = (height - scroll) / height;
        const backgroundPosition = `0 ${offset}px`;
        $top.css({ backgroundPosition });
        $daveAndDrew.css({ opacity });
    });
}

function setupNavScroll() {
    /* eslint-disable no-new */
    new SweetScroll({
        updateURL: true,
        stopPropagation: false,
    });
    /* eslint-enable no-new */
}

function onReady() {
    setupParallax();
    setupNavScroll();
}

$document.ready(onReady);

const $document = $(document);

function setupParallax() {
    $document.scroll(() => {
        const offset = Math.round($document.scrollTop() / 3);
        $('#site-wrap').css({
            'background-position': `0 ${offset}px`,
        });
    });
}

function onReady() {
    setupParallax();
}

$document.ready(onReady);

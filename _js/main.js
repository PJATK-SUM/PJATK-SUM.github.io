import "./include/jquery.extends";
import "./include/menu.jquery";
import "./include/parallax.jquery";
import "./include/video-yt.jquery";
import "./include/carousel.jquery";
import "./include/lazy-loading";

$(document).ready(function () {
    
    $("menu").menu();
    $(".carousel").carousel();
    $(".video").video({
        autoplay: true
    });

    const showMoreBtnTextInit = $(".show-more").html();
    $(".show-more").on("click", function () {
        const more = $(this).parent().find(".more");
        more.toggleClass("expand");
        const text = more.hasClass("expand")
            ? $(this).data("close-text")
            : showMoreBtnTextInit;
        $(this).html(text);
        $(this).blur();
    });

});

/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.error('SW registration failed: ', registrationError);
        });
    });
}
/* eslint-enable no-console */
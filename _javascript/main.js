import "./include/jquery.extends";
import "./include/menu.jquery";
import "./include/parallax.jquery";
import "./include/video-yt.jquery";
import "./include/carousel.jquery";
import "./include/lazy-loading";
import "./include/txt-type";
import {fontAwesomeLoad} from "./include/fontawesome-loader";

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

    fontAwesomeLoad();
});

/* eslint-disable no-console */
/* eslint-disable no-undef */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(baseUrl + '/service-worker.js', {
        }).catch(registrationError => {
            console.error('SW registration failed: ', registrationError);
        });
    });
}
/* eslint-enable no-undef */
/* eslint-enable no-console */
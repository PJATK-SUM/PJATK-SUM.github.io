// ****** Video Youtube *******
(function ($) {
    $.fn.video = function (options) {
        options = $.extend(
            {
                autoplay: true
            },
            options
        );

        this.each(function () {
            const $el = $(this),
                $video = $el.find("figure"),
                $body = $("body"),
                $button = $("<button></button>"),
                $imageWrapper = $('<div class="image-wrapper"></div>'),
                $loader = $(
                    '<div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div>'
                ),
                $lightBox = $('<div class="light-box"></div>'),
                $lightBoxCon = $('<div class="light-box-con"></div>'),
                $lightBoxClose = $('<button class="light-box-close"></button>');

            $lightBoxCon.append($loader);
            $lightBoxCon.prepend($lightBoxClose);

            $button.prepend($imageWrapper);
            $video.prepend($button);

            $video.each(function () {
                const $vi = $(this),
                    url = $vi.data("url"),
                    id = url.split("?v=")[1],
                    text = $vi.text().trim().replaceAll('"', ""),
                    $img = $("<img/>");

                $img
                    .attr("alt", text)
                    .attr(
                        "src",
                        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                    )
                    .attr("data-src", "https://i1.ytimg.com/vi/" + id + "/mqdefault.jpg")
                    .attr("width", 0)
                    .attr("height", 0)
                    .addClass("lazy");

                $img.on("lazy-onload", (e) => {
                    $(e.target)
                        .parent()
                        .width(e.target.getAttribute("width"))
                        .height(e.target.getAttribute("height"));
                });

                $vi.data("id", id);
                $vi.find("button").attr("aria-label", text);
                $vi.find(".image-wrapper").prepend($img);

                $vi.find("button").on("click", function () {
                    showLightBox(this);
                });
            });

            const resizeWindow = () => {
                if ($lightBoxCon.length) {
                    $lightBoxCon.css(
                        "margin-top",
                        "-" + $lightBoxCon.height() / 2 + "px"
                    );
                }
            };

            const showLightBox = (object) => {
                const id = $(object).parent().data("id");

                $lightBoxCon.append(loadVideo(id));
                $lightBox.append($lightBoxCon);
                $body.css("overflow", "hidden");
                $body.append($lightBox);

                resizeWindow();

                $lightBox.on("click", function () {
                    hideLightBox();
                });
            };

            const hideLightBox = () => {
                $lightBoxCon.find("iframe").remove();
                $lightBox.remove();
                $body.css("overflow", "");
            };

            const loadVideo = (id) =>
                `<iframe src="https://www.youtube-nocookie.com/embed/${id}${
                    options.autoplay ? "?autoplay=1" : ""
                }" frameborder="0" allowfullscreen loading="lazy">></iframe>`;

            $(window).resize(() => {
                resizeWindow();
            });
        });
    };
}(jQuery));

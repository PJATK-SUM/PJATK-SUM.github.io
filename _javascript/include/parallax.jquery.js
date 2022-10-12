// ****** Parallax *******

(function ($) {
    
    $.fn.parallax = function () {
        this.each(function () {
            var $el = $(this);
            var src = $el.data("src");
            var size = $el.data("size") == undefined ? 1000 : $el.data("size");
            var elTop = $el.offset().top;

            var $image = $('<div class="parallax-img"></div>');
            $el.prepend($image);

            var marginTop = "-" + size / 5 + "px";

            $image.css({
                marginTop: marginTop,
                backgroundImage: "url(" + src + ")",
                height: $el.outerHeight() + size + "px"
            });

            var transfor = function (object) {
                var scrollTop = $(object).scrollTop();
                var paralax = (elTop - scrollTop) / 4;

                $image.css({
                    transform: "translate3d(0px, " + paralax + "px, 0px)"
                });
            };

            $(window).bind("scroll", function () {
                transfor(this);
            });

            setTimeout(function () {
                elTop = $el.offset().top;
            }, 1000);
        });
    };
}(jQuery));

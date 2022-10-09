(function ($) {
    

    // Passive event listeners
    $.event.special.touchstart = {
        setup: function (_, ns, handle) {
            this.addEventListener("touchstart", handle, {
                passive: !ns.includes("noPreventDefault")
            });
        }
    };
    $.event.special.touchmove = {
        setup: function (_, ns, handle) {
            this.addEventListener("touchmove", handle, {
                passive: !ns.includes("noPreventDefault")
            });
        }
    };

    // ******  Update object jQuery ********
    $.fn.update = function () {
        var newElements = $(this.selector),
            i;
        for (i = 0; i < newElements.length; i++) {
            this[i] = newElements[i];
        }
        for (; i < this.length; i++) {
            this[i] = undefined;
        }
        this.length = newElements.length;
        return this;
    };

    // ******  Animation fadeInUp ********
    $.fn.fadeInUp = function () {
        var animatedPositionTop = [];
        var $this = $(this);
        var offsetElement = 100;
        this.each(function (index) {
            var $el = $(this);
            $el.css("opacity", 0);

            animatedPositionTop[index] = $el.offset().top + offsetElement;
        });

        var leftRang = 0,
            indexArr = 0,
            tmpIndex = -1;
        var windowHeight = $(window).height();
        var animation = function (window) {
            if (animatedPositionTop.length) {
                var scrollTop = $(window).scrollTop() + windowHeight;

                leftRang = animatedPositionTop[indexArr];

                if (scrollTop >= leftRang) {
                    if (tmpIndex != indexArr) {
                        tmpIndex = indexArr;
                        var $el = $this.eq(indexArr);
                        $el.addClass("fadeInUp");
                        $el.one(
                            "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                            function () {
                                $el.removeClass("fadeInUp");
                                $el.css("opacity", 1);
                            }
                        );
                    }
                    indexArr++;
                }
            }
        };

        $(window).bind("scroll", function () {
            animation(this);
        });
    };
}(jQuery));

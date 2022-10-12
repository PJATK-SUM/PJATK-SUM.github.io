// ****** Carousel *******
(function ($) {
    
    $.fn.carousel = function (options) {
        options = $.extend(
            {
                classNameElement: "carousel-cell",
                pauseTime: 10000,
                auto: true
            },
            options
        );

        this.each(function () {
            var $el = $(this),
                $cell = $el.find("." + options.classNameElement),
                $container = $cell
                    .wrapAll('<div class="carousel-container"></div>')
                    .parent(),
                $next = $el.find(".next"),
                $prev = $el.find(".prev"),
                interval = null,
                cWidth = 0;

            var resizeWindow = function () {
                cWidth = $el.width();
                if (!$cell.length) {
                    $cell = $el.find("." + options.classNameElement);
                }
                $cell.each(function () {
                    $(this).css("width", cWidth + "px");
                });
                $container.css("width", $cell.length * cWidth + "px");
                stay();
            };

            var transition = {
                stop: function () {
                    $container.css({
                        webkitTransition: "none",
                        transition: "none"
                    });
                },
                clear: function () {
                    $container.css({
                        webkitTransition: "",
                        transition: ""
                    });
                }
            };

            var transform = {
                set: function (position) {
                    $container.css(
                        "transform",
                        "translate3d(" + position + "px, 0px, 0px)"
                    );
                },
                get: function () {
                    return parseInt($container.css("transform").split(",")[4]);
                }
            };

            var append = function () {
                var cloneFirst = $cell.first().clone().addClass("clone");
                var cloneLast = $cell.last().clone().addClass("clone");
                $cell.first().before(cloneLast);
                $cell.last().after(cloneFirst);
                $cell.update();
            };

            var init = function () {
                append();
                resizeWindow();
                scrollFirst();

                $next.on("click", function () {
                    scrollNext();
                });
                $prev.on("click", function () {
                    scrollPrev();
                });
                if (options.auto) {
                    interval = setTimeout(function () {
                        scrollNext();
                    }, options.pauseTime);
                }
            };

            var scrollFirst = function () {
                transform.set(-cWidth);
                transition.stop();
                $cell.first().next().addClass("active");
            };

            var stay = function () {
                transform.set(-getNumberActive() * cWidth);
                transition.clear();
            };

            var getNumberActive = function () {
                var nrElement = 0;
                $cell.each(function (index) {
                    nrElement = index;
                    return !$(this).hasClass("active");
                });
                return nrElement;
            };

            var speedScrollTo = function (number) {
                if (number <= $cell.length) {
                    transform.set(-number * cWidth);
                    transition.stop();
                    $cell.removeClass("active").eq(number).addClass("active");
                } else {
                    scrollFirst();
                }
            };

            var scrollTo = function (number) {
                if (number < $cell.length) {
                    transform.set(-number * cWidth);

                    if (!$cell.eq(number).hasClass("clone")) {
                        $cell.removeClass("active").eq(number).addClass("active");
                    } else if ($cell.eq(number).hasClass("clone")) {
                        var count = 0;
                        $container.on(
                            "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                            function (e) {
                                if (count == 0) {
                                    if (number == 0) {
                                        speedScrollTo($cell.length - 2);
                                    } else if (number == $cell.length - 1) {
                                        speedScrollTo(1);
                                    }
                                    $(this).off(e);
                                    count++;
                                }
                            }
                        );
                    }
                } else {
                    scrollFirst();
                }
                transition.clear();
            };

            var scrollNext = function () {
                var active = getNumberActive();
                scrollTo(active + 1);
                clearInterval(interval);
                if (options.auto) {
                    interval = setTimeout(function () {
                        scrollNext();
                    }, options.pauseTime);
                }
            };

            var scrollPrev = function () {
                var active = getNumberActive();
                scrollTo(active - 1);
                clearInterval(interval);
                if (options.auto) {
                    interval = setTimeout(function () {
                        scrollNext();
                    }, options.pauseTime);
                }
            };

            var controlPosition = function () {
                var end = transform.get();
                var padding = cWidth / 1.5;
                var goTo = true;

                var actual = end + getNumberActive() * cWidth;
                if (actual > 0) {
                    padding -= padding / 1.8;
                }
                $cell.each(function (index) {
                    var checked = -(end - (end < 0 ? padding : -padding));
                    var rangeLeft = index * cWidth;
                    var rangeRight = index * cWidth + cWidth;

                    if (checked >= rangeLeft && checked < rangeRight) {
                        scrollTo(index);
                        return goTo = false;
                    }
                });

                if (goTo) scrollFirst();

                if (options.auto) {
                    interval = setTimeout(function () {
                        scrollNext();
                    }, options.pauseTime);
                }
            };

            $el
                .on("touchstart", function (event) {
                    clearInterval(interval);
                    var start = event.originalEvent.touches[0].pageX;
                    var actual = transform.get();

                    $(this).on("touchmove", function (event) {
                        var position = event.originalEvent.touches[0].pageX;
                        var move = -(start - position - actual);
                        transform.set(move);
                        transition.stop();
                    });
                })
                .on("touchend", function () {
                    $(this).off("touchmove");
                    controlPosition();
                });

            $el
                .mousedown(function (event) {
                    clearInterval(interval);
                    $(this).find("img").attr("draggable", "false");
                    $(this).css("cursor", "move");
                    var start = event.pageX;
                    var actual = transform.get();
                    $(this).on("mousemove", function (event) {
                        var position = event.pageX;
                        var move = -(start - position - actual);
                        transform.set(move);
                        transition.stop();
                    });
                })
                .on("mouseup mouseleave", function () {
                    $(this).find("img").removeAttr("draggable");
                    $(this).css("cursor", "");
                    $(this).off("mousemove");
                    controlPosition();
                });

            init();

            $(window).resize(function () {
                resizeWindow();
            });
        });
        return this;
    };
}(jQuery));

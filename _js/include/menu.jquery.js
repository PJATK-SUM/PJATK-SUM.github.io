
// ******  Menu ********

(function ($) {
    

    $.fn.menu = function (options) {
        options = $.extend(
            {
                classNameFixed: "fixed-menu",
                classNameRwd: "rwd-menu"
            },
            options
        );

        this.each(function () {
            var $el = $(this),
                elTop = $el.offset().top,
                elHeight = $el.outerHeight(),
                $rwdMenu = $('<div class="' + options.classNameRwd + '"></div>'),
                $item = $el.find("menuitem"),
                $languageSelector = $el.find('.language-selector').clone(),
                $itemLink = $item.find("> a"),
                isMobile = false,
                $title = $("<h1></h1>");

            $title.text($("#homepage .title h1").text());
            $rwdMenu.append($title);
            $rwdMenu.append($languageSelector)
            $rwdMenu.append(
                '<button class="menu-hamburger" aria-label="menu"><div class="bar"></div><div class="bar"></div><div class="bar"></div></button>'
            );

            var $button = $rwdMenu.find("button.menu-hamburger");

            var scrollMenuCount = false;

            var addScrollMenu = function () {
                if (!scrollMenuCount) {
                    if (!$el.hasClass(options.classNameFixed)) {
                        $el.next().css("margin-top", elHeight + "px");
                        $el.addClass(options.classNameFixed);

                        closeRwdMenu();

                        scrollMenuCount = !scrollMenuCount;
                    }
                }
            };

            var removeScrollMenu = function () {
                if (scrollMenuCount) {
                    if ($el.hasClass(options.classNameFixed)) {
                        $el.removeClass(options.classNameFixed);
                        $el.next().css("margin-top", "");
                    }
                    scrollMenuCount = !scrollMenuCount;
                }
            };

            $itemLink.on("click", function () {
                $itemLink.removeClass("active");
                $(this).addClass("active");
            });

            var arrElementTop = [];
            var setActive = function () {
                var url = window.location.hash;
                $itemLink.removeClass("active");
                var $a = null;

                if (url === "") {
                    $a = $itemLink.first().addClass("active");
                } else {
                    $a = $item.find('*[href="' + url + '"]');
                    $a.addClass("active");
                }

                setTimeout(function () {
                    $itemLink.each(function (index) {
                        var href = $(this).attr("href");
                        arrElementTop[index] = $(href).offset().top;
                    });
                }, 200);

                setActivePosition($a.offset().top);
            };

            var leftRang = 0,
                rightRang = 0,
                indexArr = 0,
                tmpTop = 0,
                tmpIndex = -1;

            var setActivePosition = function (position) {
                if (arrElementTop.length > 1) {
                    leftRang = arrElementTop[indexArr];
                    if (indexArr < arrElementTop.length - 1) {
                        rightRang = arrElementTop[indexArr + 1];
                    } else {
                        rightRang = leftRang * 2;
                    }

                    if (position >= leftRang && position < rightRang) {
                        if (tmpIndex != indexArr) {
                            tmpTop = position;
                            tmpIndex = indexArr;
                            $itemLink.removeClass("active");
                            var $a = $itemLink.eq(indexArr);
                            $a.addClass("active");
                        }
                    } else {
                        if (tmpTop <= position) {
                            if (indexArr < arrElementTop.length - 1) indexArr++;
                        } else {
                            indexArr--;
                        }
                    }
                }
            };

            var closeRwdMenu = function () {
                if ($button.hasClass("is-active")) {
                    $el.css("margin-right", "");
                    $button.removeClass("is-active");
                }
            };

            var init = function () {
                var windowWidth = $(window).width();

                setActive();

                if (windowWidth > 762) {
                    isMobile = false;
                    if ($rwdMenu.length > 0) {
                        $rwdMenu.remove();
                    }
                } else {
                    isMobile = true;
                    $el.prepend($rwdMenu);
                    removeScrollMenu();
                }

                $button.on("click", function () {
                    var right = parseInt($el.css("margin-right"));
                    if (right !== 0) {
                        $el.css("margin-right", 0);
                        $button.addClass("is-active");
                        return;
                    }

                    closeRwdMenu();
                });

                $item.on("click", function () {
                    closeRwdMenu();
                });
            };

            init();

            $(window).bind("scroll", function () {
                var scrollTop = $(this).scrollTop();
                if (!isMobile) {
                    if (scrollTop + 100 > elTop) {
                        addScrollMenu();
                    } else {
                        removeScrollMenu();
                    }
                }

                setActivePosition(scrollTop);
            });

            $(window).bind("resize", function () {
                init();
            });
        });
    };
}(jQuery));

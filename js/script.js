(function ($) {


    // ******  Update object jQuery ********
    $.fn.update = function () {
        var newElements = $(this.selector), i;
        for (i = 0; i < newElements.length; i++) {
            this[i] = newElements[i];
        }
        for (; i < this.length; i++) {
            this[i] = undefined;
        }
        this.length = newElements.length;
        return this;
    };

    // ****** Carousel *******
    $.fn.carousel = function (options) {

        options = $.extend({
            classNameElement: 'carousel-cell',
            pauseTime: 10000,
            auto: true,
            debug: false
        }, options);

        this.each(function () {
            var $el = $(this);

            var $cell = $el.find('.' + options.classNameElement);
            var $container = $cell.wrapAll('<div class="carousel-container"></div>').parent();
            var $next = $el.find('.next');
            var $prev = $el.find('.prev');
            var interval = null;

            var cWidth = 0;

            var resizeWindow = function () {
                cWidth = $el.width();
                $cell.each(function (index) {
                    $(this).css('width', cWidth + 'px');
                });

                $container.css('width', $cell.length * cWidth + 'px');
                stay();
            };

            var transition = {
                stop: function () {
                    $container.css({
                        webkitTransition: 'none',
                        transition: 'none'
                    })
                },
                clear: function () {
                    $container.css({
                        webkitTransition: '',
                        transition: ''
                    })
                }
            };

            var getCssWidth = function (object) {
                return parseFloat(object.css('width'));
            };

            var transform = {
                set: function (position) {
                    $container.css('transform', 'translate3d(' + position + 'px, 0px, 0px)');
                },
                get: function () {
                    return parseInt($container.css('transform').split(',')[4]);
                }
            };

            var append = function () {
                var cloneFirst = $cell.first().clone().addClass('clone');
                var cloneLast = $cell.last().clone().addClass('clone');
                $cell.first().before(cloneLast);
                $cell.last().after(cloneFirst);
                $cell.update();

            };

            var init = function () {
                append();
                resizeWindow();
                scrollFirst();

                $next.on('click', function () {
                    scrollNext()
                });
                $prev.on('click', function () {
                    scrollPrev()
                });
                if (options.auto) interval = setTimeout(function () {
                    scrollNext()
                }, options.pauseTime);
            };

            var scrollFirst = function () {
                transform.set(-cWidth);
                transition.stop();
                $cell.first().next().addClass('active');
            };

            var stay = function () {
                transform.set(-getNumberActive() * cWidth);
                transition.clear();
            };

            var getNumberActive = function () {
                var nrElement = 0;
                $cell.each(function (index) {
                    nrElement = index;
                    return (!$(this).hasClass('active'))
                });
                return nrElement;
            };

            var speedScrollTo = function (number) {
                debug('spped22', number);
                if (number <= $cell.length) {
                    transform.set(-number * cWidth);
                    transition.stop();
                    $cell.removeClass('active').eq(number).addClass('active');
                } else
                    scrollFirst();


            };

            var scrollTo = function (number) {
                if (number < $cell.length) {
                    transform.set(-number * cWidth);

                    if (!$cell.eq(number).hasClass('clone')) {
                        $cell.removeClass('active').eq(number).addClass('active');

                    } else if ($cell.eq(number).hasClass('clone')) {
                        var count = 0;
                        $container.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                            function (e) {
                                if (count == 0) {
                                    debug('spped', $cell.length);
                                    if (number == 0) {
                                        speedScrollTo($cell.length - 2)
                                    } else if (number == $cell.length - 1) {
                                        speedScrollTo(1);
                                    }
                                    $(this).off(e);
                                    count++;
                                }
                            });
                    }

                }
                else
                    scrollFirst();
                transition.clear();
            };

            var scrollNext = function () {
                var active = getNumberActive();
                scrollTo(active + 1);
                clearInterval(interval);
                if (options.auto) interval = setTimeout(function () {
                    scrollNext()
                }, options.pauseTime);
            };

            var scrollPrev = function () {
                var active = getNumberActive();
                scrollTo(active - 1);
                clearInterval(interval);
                if (options.auto) interval = setTimeout(function () {
                    scrollNext()
                }, options.pauseTime);
            };

            var controlPosition = function () {
                var end = transform.get();
                var padding = cWidth / 1.5;
                var goTo = true;

                var actual = end + (getNumberActive() * cWidth);
                if (actual > 0) {
                    padding -= (padding / 1.8);
                }
                $cell.each(function (index) {
                    var checked = -(end - (end < 0 ? padding : -padding));
                    var rangeLeft = index * cWidth;
                    var rangeRight = (index * cWidth) + cWidth;

                    if (checked >= rangeLeft && checked < rangeRight) {
                        scrollTo(index);
                        return goTo = false;
                    }
                });

                if (goTo)
                    scrollFirst();

                if (options.auto) interval = setTimeout(function () {
                    scrollNext()
                }, options.pauseTime);
            };

            var debug = function (title, value) {
                if (!options.debug)
                    return;

                if (title == 'O')
                    console.log(value);
                else
                    console.log(title + ': ' + value);

            };


            $el.on('touchstart', function (event) {
                clearInterval(interval);
                var start = event.originalEvent.touches[0].pageX;
                var actual = transform.get();

                $(this).on("touchmove", function (event) {
                    var position = event.originalEvent.touches[0].pageX;
                    var move = -(start - position - actual);
                    transform.set(move);
                    transition.stop();

                });

            }).on('touchend', function (event) {
                $(this).off('touchmove');
                controlPosition();

            });

            $el.mousedown(function (event) {
                clearInterval(interval);
                $(this).find('img').attr('draggable', 'false');
                $(this).css('cursor', 'move');
                var start = event.pageX;
                var actual = transform.get();
                $(this).on("mousemove", function (event) {
                    var position = event.pageX;
                    var move = -(start - position - actual);
                    transform.set(move);
                    transition.stop();
                });
            }).on('mouseup mouseleave', function () {
                $(this).find('img').removeAttr('draggable');
                $(this).css('cursor', '');
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

    // ****** Video Youtube *******
    $.fn.video = function (options) {
        options = $.extend({
            autoplay: true,
            debug: false,
        }, options);

        var debug = function (title, value) {
            if (!options.debug)
                return;

            if (title == 'O')
                console.log(value);
            else
                console.log(title + ': ' + value);

        };


        this.each(function () {
            var $el = $(this);
            var $video = $el.find('figure');
            var $body = $('body');
            var $button = $('<button></button>');
            var $loader = $('<div class="bubblingG"><span id="bubblingG_1"></span> <span id="bubblingG_2"> </span> <span id="bubblingG_3"></span></div>');
            var $lightBox = $('<div class="light-box"></div>');
            var $lightBoxCon = $('<div class="light-box-con"></div>');
            var $lightBoxClose = $('<button class="light-box-close"></button>');

            $lightBoxCon.append($loader);
            $lightBoxCon.prepend($lightBoxClose);
            $video.prepend($button);

            $video.each(function () {
                $vi = $(this);
                var url = $vi.data('url');
                var id = url.split('?v=')[1];
                $vi.data('id', id);
                $vi.find('button').prepend('<img src="http://img.youtube.com/vi/' + id + '/0.jpg">');

                $vi.find('button').on('click', function () {
                    showLightBox(this);
                });
            });

            var resizeWindow = function () {
                if ($lightBoxCon.length) {
                    $lightBoxCon.css('margin-top', '-' + $lightBoxCon.height() / 2 + 'px');
                }
            };

            var showLightBox = function (object) {
                var id = $(object).parent().data('id');

                $lightBoxCon.append(loadVideo(id));
                $lightBox.append($lightBoxCon);
                $body.css('overflow', 'hidden');
                $body.append($lightBox);

                resizeWindow();

                $lightBox.on('click', function () {
                    hideLightBox()
                });
            };

            var hideLightBox = function () {
                $lightBoxCon.find('iframe').remove();
                $lightBox.remove();
                $body.css('overflow', '');
            };

            var loadVideo = function (id) {
                var autoplay = "";
                if (options.autoplay)
                    autoplay = "?autoplay=1";
                return '<iframe src="https://www.youtube.com/embed/' + id + autoplay + '" frameborder="0" allowfullscreen></iframe>'
            };


            $(window).resize(function () {
                resizeWindow();
            })

        });
    };


    // ******  Menu ********
    $.fn.menu = function (options) {
        options = $.extend({
            classNameFixed: 'fixed-menu',
            classNameRwd: 'rwd-menu'
        }, options);

        this.each(function () {
            var $el = $(this);
            var elTop = $el.offset().top;
            var elHeight = $el.outerHeight();
            var $rwdMenu = $('<div class="' + options.classNameRwd + '"></div>');
            var $item = $el.find('menuitem');
            var $itemLink = $item.find('a');
            var isMobile = false;

            $rwdMenu.append('<button class="c-hamburger c-hamburger--htla"><span>toggle menu</span></button>');
            var title = $('<h3></h3>');
            title.text($('title').text());
            $rwdMenu.append(title);
            var $button = $rwdMenu.find('button');


            var scrollMenuCount = false;


            var addScrollMenu = function () {
                if (!scrollMenuCount) {
                    if (!$el.hasClass(options.classNameFixed)) {
                        var nextMarginTop = parseFloat($el.next().css('margin-top'));
                        $el.next().css('margin-top', elHeight + 'px');
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
                        $el.next().css('margin-top', '');
                    }
                    scrollMenuCount = !scrollMenuCount;
                }
            };

            $itemLink.on('click', function () {
                $itemLink.removeClass('active');
                $(this).addClass('active');
            });


            var arrElementTop = [];
            var setActive = function () {
                var url = window.location.hash;
                $itemLink.removeClass('active');
                var $a = null;


                if (url == "") {
                   $a = $itemLink.first().addClass('active');

                } else {
                   $a = $item.find('*[href="' + url + '"]');

                    $a.addClass('active');
                }


                setTimeout(function(){
                    $itemLink.each(function (index) {
                        var href = $(this).attr('href');
                        arrElementTop[index] = $(href).offset().top;
                    });
                }, 200);


                setActivePosition($a.offset().top);

            };

            var leftRang = 0, rightRang = 0, indexArr = 0, tmpTop = 0, tmpIndex = -1;

            var setActivePosition = function (position) {

                if (arrElementTop.length > 1) {

                    leftRang = arrElementTop[indexArr];
                    if (indexArr < arrElementTop.length-1) {
                        rightRang = arrElementTop[indexArr + 1];
                    } else {
                        rightRang = leftRang * 2;
                    }


                    if (position >= leftRang && position < rightRang) {
                        if (tmpIndex != indexArr) {
                            tmpTop = position;
                            tmpIndex = indexArr;
                            $itemLink.removeClass('active');
                            var $a = $itemLink.eq(indexArr);
                            $a.addClass('active');
                            /*
                             if (!indexArr) {
                             window.location.hash = "#"
                             } else {
                             window.location.hash = $a.attr('href').replace("#", "");
                             }
                             */
                        }

                    } else {
                        if (tmpTop <= position) {
                             if (indexArr < arrElementTop.length-1)
                                indexArr++;
                        }
                        else {
                            indexArr--;
                        }

                    }

                }

            };


            var closeRwdMenu = function () {
                if ($button.hasClass('is-active')) {
                    $el.css('margin-left', '');
                    $button.removeClass('is-active');
                }

            };

            var init = function (object) {
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


                $button.on('click', function () {
                    var left = parseInt($el.css('margin-left'));
                    if (left != 0) {
                        $el.css('margin-left', 0);
                        $button.addClass('is-active');
                    } else {
                        closeRwdMenu()
                    }

                });

                $item.on('click', function () {
                    closeRwdMenu()
                });


            };


            init();

            $(window).bind('scroll', function () {
                var scrollTop = $(this).scrollTop();
                if (!isMobile) {

                    if ((scrollTop + 100) > elTop) {
                        addScrollMenu();

                    } else {

                        removeScrollMenu();
                    }
                }


                setActivePosition(scrollTop);


            });

            $(window).bind('resize', function () {
                init();
            })

        });
    };


    // ******  Animation fadeInUp ********
    $.fn.fadeInUp = function () {

        var animatedPositionTop = [];
        var $this = $(this);
        var offsetElement = 100;
        this.each(function (index) {
            var $el = $(this);
            $el.css('opacity', 0);

            animatedPositionTop[index] = $el.offset().top + offsetElement;

        });

        var leftRang = 0, indexArr = 0, tmpIndex = -1;
        var windowHeight = $(window).height();
        var animation = function (window) {
            if (animatedPositionTop.length) {
                var scrollTop = $(window).scrollTop() + windowHeight;

                leftRang = animatedPositionTop[indexArr];

                if (scrollTop >= leftRang) {

                    if (tmpIndex != indexArr) {
                        tmpIndex = indexArr;
                        var $el = $this.eq(indexArr);
                        $el.addClass('fadeInUp');
                        $el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                            $el.removeClass('fadeInUp');
                            $el.css('opacity', 1);
                        });
                    }
                    indexArr++
                }


            }

        };

        $(window).bind('scroll', function () {
            animation(this);

        });

    };

    // ****** Parallax *******
    $.fn.parallax = function (options) {
        options = $.extend({
            debug: false
        }, options);

        var debug = function (title, value) {
            if (!options.debug)
                return;

            if (title == 'O')
                console.log(value);
            else
                console.log(title + ': ' + value);

        };

        this.each(function () {
            var $el = $(this);
            var src = $el.data('src');
            var size = $el.data('size') == undefined ? 1000 : $el.data('size');
            var elTop = $el.offset().top;
            var windowHeight = $(window).height();

            var $image = $('<div class="parallax-img"></div>');
            $el.prepend($image);

            var marginTop = '-' + size / 5 + 'px';

            $image.css({
                marginTop: marginTop,
                backgroundImage: 'url(' + src + ')',
                height: $el.outerHeight() + size + 'px',
            });

            var transfor = function (object) {
                var scrollTop = $(object).scrollTop();

                var paralax = (elTop - scrollTop) / 4;
                debug('paralax', paralax);

                $image.css({
                    transform: 'translate3d(0px, ' + (paralax) + 'px, 0px)',
                })
            };

            $(window).bind('scroll', function () {
                transfor(this);
            });

            setTimeout(function () {
                elTop = $el.offset().top;
            }, 1000);

        });


    };

}(jQuery));


$(document).ready(function () {
    $('menu').menu();
    $('.carousel').carousel();
    $('.video').video({
        autoplay: true
    });

    // $('.animated').fadeInUp();

    $('.show-more').on('click', function () {
        $(this).parent().find('.more').slideToggle();
    }).blur();

    $(window).resize(function () {
        $('header img.bg').css('height', $(this).height() + "px");
    });

});


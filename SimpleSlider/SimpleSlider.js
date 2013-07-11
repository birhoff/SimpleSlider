(function ($) {

    "use strict";

    $.fn.SimpleSlider = function (options) {

        // create settings from defaults and user options
        var settings = $.extend({}, $.fn.SimpleSlider.defaults, options);

        var $wrapper = this;
        var $slider = $wrapper.find('ul');
        var $slides = $slider.children('li');

        var $paginationItems = null;

        var state = {
            count: $slides.length,
            animating: false,
            paused: false,
            currentSlide: 1,
            nextSlide: 0,
            currentIndex: 0,
            nextIndex: 0,
            interval: null
        };

        var init = function () {

            $wrapper.addClass("SimpleSlider-slider");

            $slides.css({
                'height': settings.height,
                'width': settings.width
            });
            $slider.css({
                'height': settings.height,
                'width': settings.width
            });
            $wrapper.css({
                'height': settings.height,
                'width': settings.width,
                'position': 'relative'
            });

            if (settings.hoverPause && settings.auto) {
                $wrapper.hover(function () {
                    if (!state.paused) {
                        clearInterval(state.interval);
                        state.paused = true;
                    }
                }, function () {
                    if (state.paused) {
                        state.interval = setInterval(function () {
                            slide("fwd", false);
                        }, settings.animationDelay);
                        state.paused = false;
                    }
                });
            }

            if (settings.navigation) {
                initNavigation();
            }

            state.currentindex = 1;

            if (settings.pagination) {
                initPagination();
            }

            initSliding();

            $slider.show();
            $slides.eq(state.currentindex).show();

            // Finally, if auto is set to true, kick off the interval
            if (settings.auto) {
                state.interval = setInterval(function () {
                    slide("fwd", false);
                }, settings.animationDelay);
            }

        }

        var initSliding = function () {

            var cloneFirst = $slides.eq(0).clone();
            var cloneLast = $slides.eq(state.count - 1).clone();

            cloneFirst.attr({'data-clone': 'last', 'data-slide': 0}).appendTo($slider).show();
            cloneLast.attr({'data-clone': 'first', 'data-slide': 0}).prependTo($slider).show();

            $slides = $slider.children('li');
            state.count = $slides.length;

            var $container = $('<div class="SimpleSlider-wrapper"></div>');


            $container.css({
                'width': settings.width,
                'height': settings.height,
                'overflow': 'hidden',
                'position': 'relative'
            });

            $slider.addClass("SimpleSlider");

            $slider.css({
                'width': settings.width * (state.count + 2),
                'left': -settings.width * state.currentSlide
            });

            $slides.css({
                'float': 'left',
                'position': 'relative',
                'display': 'list-item'
            });

            $container.prependTo($wrapper);
            $slider.appendTo($container);

        };

        var initNavigation = function () {

            var $next = $("<a href='#' class='nav next'></a>");
            $next.on('click', function () {
                slide('fwd', false);
            })
            $next.appendTo($wrapper);

            var $prev = $("<a href='#' class='nav prev'></a>");
            $prev.on('click', function () {
                slide('back', false);
            })
            $prev.appendTo($wrapper);

            var middle = ($wrapper.outerHeight() - $next.outerHeight()) / 2;
            $next.css('top', middle);
            $prev.css('top', middle);

            if (settings.navigationOnHover) {
                $next.addClass("hover-opacity");
                $prev.addClass("hover-opacity");
            }

            $next.show();
            $prev.show();
        }

        var initPagination = function () {

            var $pagination = $('<div class="SimpleSlider-pagination"></div>');

            $.each($slides, function (key) {

                var slideIndex = key + 1;
                var destinationSlide = key + 2;


                var paginationItem = $("<a href='#' class='SimpleSlider-pagination-item'></a>");

                if (slideIndex === state.currentSlide) {
                    paginationItem.addClass('active');
                }

                paginationItem.on('click', function (e) {
                    e.preventDefault();

                    if (!state.animating && state.currentSlide !== destinationSlide) {
                        slide(false, destinationSlide);
                    }
                });

                // add the marker to the wrapper
                paginationItem.appendTo($pagination);

            });

            $paginationItems = $pagination.children();
            $pagination.appendTo($wrapper);
            var paginationItemWidth = $paginationItems.outerWidth(true);
            $pagination.css('width', paginationItemWidth * $paginationItems.length);
        }

        var slide = function (direction, position) {

            if (state.animating)return;

            state.animating = true;

            if (position) {
                state.nextslide = position;
                state.nextindex = position - 1;
            }
            else {
                setNextSlide(direction);
            }

            if (settings.pagination) {

                var itemIndex = state.nextindex - 1;

                if (itemIndex === state.count - 2) {
                    itemIndex = 0;
                }
                else if (itemIndex === -1) {
                    itemIndex = state.count - 3;
                }

                $paginationItems.removeClass('active');
                $paginationItems.eq(itemIndex).addClass('active');
            }

            $slider.animate({'left': -state.nextindex * settings.width }, settings.animationDuration, function () {

                state.currentSlide = state.nextslide;
                state.currentindex = state.nextindex;

                // is the current slide a clone?
                if ($slides.eq(state.currentindex).attr('data-clone') === 'last') {

                    // affirmative, at the last slide (clone of first)
                    $slider.css({'left': -settings.width });
                    state.currentSlide = 2;
                    state.currentindex = 1;

                }
                else if ($slides.eq(state.currentindex).attr('data-clone') === 'first') {

                    // affirmative, at the fist slide (clone of last)
                    $slider.css({'left': -settings.width * (state.count - 2)});
                    state.currentSlide = state.count - 1;
                    state.currentindex = state.count - 2;

                }

                state.animating = false;

            });
        };

        var setNextSlide = function (direction) {

            if (direction === "fwd") {

                if ($slides.eq(state.currentindex).next().length) {
                    state.nextindex = state.currentindex + 1;
                    state.nextslide = state.currentSlide + 1;
                }
                else {
                    state.nextindex = 0;
                    state.nextslide = 1;
                }

            }
            else {

                if ($slides.eq(state.currentindex).prev().length) {
                    state.nextindex = state.currentindex - 1;
                    state.nextslide = state.currentSlide - 1;
                }
                else {
                    state.nextindex = state.count - 1;
                    state.nextslide = state.count;
                }

            }

        };

        init();

        return this;
    };

    $.fn.SimpleSlider.defaults = {

        width: 900,
        height: 500,

        animationDuration: 450, // length of transition
        animationDelay: 4000, // delay between transitions
        auto: true, // enable/disable auto slide rotation

        navigation: true, // enable/disable next + previous UI elements
        pagination: true, // enable/disable pagination

        hoverPause: true,     // enable/disable pause slides on hover
        navigationOnHover: true // enable/disable navigation arrows on slider hover
    }
})(jQuery);
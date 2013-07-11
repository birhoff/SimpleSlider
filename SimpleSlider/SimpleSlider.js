(function ($) {

    "use strict";

    $.fn.SimpleSlider = function (options) {

        // create settings from defaults and user options
        var settings = $.extend({}, $.fn.SimpleSlider.defaults, options);

        var $wrapper = this;
        var $slider = $wrapper.find('ul');
        var $slides = $slider.children('li');

        var $clone_first = null;
        var $clone_last = null;
        var $container = null;

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

            if (settings.hoverpause && settings.automatic) {
                $wrapper.hover(function () {
                    if (!state.paused) {
                        clearInterval(state.interval);
                        state.paused = true;
                    }
                }, function () {
                    if (state.paused) {
                        state.interval = setInterval(function () {
                            slide("fwd", false);
                        }, settings.animdelay);
                        state.paused = false;
                    }
                });
            }

            initSliding();

            state.currentindex = 1;
            state.currentslide = 2;

            $slider.show();
            $slides.eq(state.currentindex).show();

            // Finally, if automatic is set to true, kick off the interval
            if (settings.automatic) {
                state.interval = setInterval(function () {
                    slide("fwd", false);
                }, settings.animdelay);
            }

        }

        var initSliding = function () {

            $clone_first = $slides.eq(0).clone();
            $clone_last = $slides.eq(state.count - 1).clone();

            $clone_first.attr({'data-clone': 'last', 'data-slide': 0}).appendTo($slider).show();
            $clone_last.attr({'data-clone': 'first', 'data-slide': 0}).prependTo($slider).show();

            $slides = $slider.children('li');
            state.count = $slides.length;

            $container = $('<div class="simpleSlider-wrapper"></div>');


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

        var readOptions = function (wrapper, options) {

            if (!options.width) {
                options.width = wrapper.css('width');
            }

            if (!options.height) {
                options.height = wrapper.css('height');
            }
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

            state.slidewidth = settings.width;

            $slider.animate({'left': -state.nextindex * state.slidewidth }, settings.animduration, function () {

                state.currentslide = state.nextslide;
                state.currentindex = state.nextindex;

                // is the current slide a clone?
                if ($slides.eq(state.currentindex).attr('data-clone') === 'last') {

                    // affirmative, at the last slide (clone of first)
                    $slider.css({'left': -state.slidewidth });
                    state.currentslide = 2;
                    state.currentindex = 1;

                }
                else if ($slides.eq(state.currentindex).attr('data-clone') === 'first') {

                    // affirmative, at the fist slide (clone of last)
                    $slider.css({'left': -state.slidewidth * (state.count - 2)});
                    state.currentslide = state.count - 1;
                    state.currentindex = state.count - 2;

                }

                state.animating = false;

            });
        };

        var setNextSlide = function (direction) {

            if (direction === "fwd") {

                if ($slides.eq(state.currentindex).next().length) {
                    state.nextindex = state.currentindex + 1;
                    state.nextslide = state.currentslide + 1;
                }
                else {
                    state.nextindex = 0;
                    state.nextslide = 1;
                }

            }
            else {

                if ($slides.eq(state.currentindex).prev().length) {
                    state.nextindex = state.currentindex - 1;
                    state.nextslide = state.currentslide - 1;
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
        // w + h
        width: 900,
        height: 500,

        // transition values
        animduration: 450,      // length of transition
        animdelay: 4000,     // delay between transitions
        automatic: true,     // enable/disable automatic slide rotation

        // control and marker configuration
        shownavs: true,     // enable/disable next + previous UI elements

        // interaction values
        hoverpause: true,     // enable/disable pause slides on hover

        // presentational options
        usecaptions: true,     // enable/disable captions using img title attribute
        randomstart: false     // start from a random slide
    }
})(jQuery);
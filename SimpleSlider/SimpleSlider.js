(function ($) {

    "use strict";

    $.fn.SimpleSlider = function (options) {

        // create settings from defaults and user options
        var settings = $.extend({}, $.SimpleSlider.defaults, options);

        var $wrapper = this;
        var $slider = $wrapper.find('ul');
        var $slides = $slider.children('li');

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

        }

        var readOptions = function (wrapper, options) {

            if (!options.width) {
                options.width = wrapper.css('width');
            }

            if (!options.height) {
                options.height = wrapper.css('height');
            }
        }

        return this;
    };

    $.SimpleSlider.defaults = {
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
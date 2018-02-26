define([
    '../error/ArgumentError',
    '../util/Logger',
    './viewUtils',

    'jquery'
], function (ArgumentError,
             Logger,
             viewUtils,

             $) {
    "use strict";

    /**
     * Base class for creating sliders.
     * @param options {Object}
     * @param options.id {String} Id of the element in which should be slider rendered
     * @param options.type {boolean} true, if the slider should have two handles
     * @param options.range {Array} min and max value of the slider
     * @param options.step {number} step of the slider
     * @param options.values {Array} current slider values
     * @constructor
     */

    var Slider = function (options) {
        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Slider", "constructor", "missingElementId"));
        }
        if (!options.range || options.range.length == 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Slider", "constructor", "missingSliderRange"));
        }
        if (!options.values || options.values.length == 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Slider", "constructor", "missingSliderValues"));
        }

        this._id = "#" + options.id;
        this._range = options.range;
        this._values = options.values;
        this._step = options.step || 1;

        if (options.type){
            this._type = options.type;
            this.buildRangeSlider();
        }
        else {
            this._type = "min";
            this.buildFixedMinSlider();
        }

        this.addFocusListener();
    };

    /**
     * Build the slider with range
     */
    Slider.prototype.buildRangeSlider = function(){
        var self = this;
        return $(this._id).slider({
            range: self._type,
            step: self._step,
            min: self._range[0],
            max: self._range[1],
            values: self._values
        });
    };

    /**
     * Build the slider with fixed minimum
     */
    Slider.prototype.buildFixedMinSlider = function(){
        var self = this;
        return $( this._id ).slider({
            range: "min",
            step: self._step,
            min: self._range[0],
            max: self._range[1],
            value: self._values[0]
        });
    };

    /**
     * Add the focus change listener to slider. When there is a focus, a popup shows up.
     */
    Slider.prototype.addFocusListener = function(){
        $( this._id ).off("focusin").on("focusin",function(){
            $(this).siblings('.slider-popup').addClass('open');
        });

        $( this._id ).off("focusout").on("focusout",function(){
            $(this).siblings('.slider-popup').removeClass('open');
        });
    };

    return Slider;
});

define(['../../../../error/ArgumentError',
        '../../../../util/histogram/Histogram',
        '../../../../util/Logger',
        '../../../../util/Slider',
        '../../../View',
        '../../../../util/viewUtils',

        'jquery',
        'string',

        'text!./SliderBox.html',
        'css!./SliderBox'
], function (ArgumentError,
             Histogram,
             Logger,
             Slider,
             View,
             viewUtils,

             $,
             S,

             htmlContent) {
    "use strict";

    /**
     * This class represents the row with the slider
     * @param options {Object}
     * @param options.attrId {string} ID of the attribute
     * @param options.attrSetId {string} ID of the attribute set ID
     * @param options.id {string} ID of the slider
     * @param options.name {string} slider label
     * @param options.target {Object} JQuery selector representing the target element where should be the slider rendered
     * @param options.range {Array} min and max value of the slider
     * @param options.step {number} step of the slider
     * @param options.values {Array} current slider values
     * @param options.isRange {boolean} true, if the slider should have two handles
     * @constructor
     */
    var SliderBox = function(options) {
        View.apply(this, arguments);

        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SliderBox", "constructor", "missingBoxId"));
        }
        if (!options.name){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SliderBox", "constructor", "missingBoxName"));
        }
        if (!options.target){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SliderBox", "constructor", "missingTarget"));
        }

        this._id = options.id;
        this._name = options.name;
        this._target = options.target;
        this._step = options.step || 1;
        this._range = options.range;
        this._values = options.values;
        this._isRange = options.isRange;

        if (options.units){
            this._name = this._name + " (" + options.units + ")";
        }

        this.build();
    };

    SliderBox.prototype = Object.create(View.prototype);

    /**
     * Build the SelectBox and add a listener to it
     */
    SliderBox.prototype.build = function (){
        var self = this;
        var html = S(htmlContent).template({
            id: this._id,
            name: this._name,
            labelMin: viewUtils.numberFormat(this._range[0], true, 2),
            labelMax: viewUtils.numberFormat(this._range[1], true, 2),
            thresholdMin: Math.round(this._range[0] * 100) / 100,
            thresholdMax: Math.round(this._range[1] * 100) / 100
        }).toString();

        this._target.append(html).ready(function(){
            self.buildSlider();
            self.histogram = self.buildHistogram();
            self.addSlideListeners(self._id, self._isRange);
            self.addInputListener(self._id);
        });
    };

    /**
     * It builds the slider
     * @returns {Slider}
     */
    SliderBox.prototype.buildSlider = function(){
        return new Slider({
            id: this._id,
            type: this._isRange,
            range: this._range,
            step: this._step,
            values: this._values
        });
    };

    /**
     * It builds the histogram
     * @returns {Histogram}
     */
    SliderBox.prototype.buildHistogram = function(){
        return new Histogram({
            id: this._id,
            minimum: this._range[0],
            maximum: this._range[1]
        });
    };

	/**
     * Set the width of the popup
     */
    SliderBox.prototype.rebuildPopup = function(){
        var slider = $("#" + this._id);
        var sliderWidth = slider.width();
        slider.siblings(".slider-popup").css("width", sliderWidth);
    };

    /**
     * Add listener to slider and remove the old one
     * @param id {string}
     * @param isRange {boolean} true, if slider has two handles
     */
    SliderBox.prototype.addSlideListeners = function(id, isRange){
        var self = this;
        var selector = $("#" + id);
        selector.off('slidestop');
        selector.on('slidestop', function(e){
            if (isRange){
                self._values = $(this).slider("values");
                self.setInputMin($(this).siblings().find('.input-min'), self._values[0]);
                self.setInputMax($(this).siblings().find('.input-max'), self._values[1]);
            }
            else {
                var minVal = $(this).slider("option", "min");
                var currentVal = $(this).slider("value");
                self._values = [minVal, currentVal];
            }
        });

        selector.off('slide').on('slide', function(e){
            if (isRange){
                var values = $(this).slider("values");
                if (values[0] != values[1]){
                    self.histogram.selectBars(values);
                }
                self.setInputMin($(this).siblings().find('.input-min'), values[0]);
                self.setInputMax($(this).siblings().find('.input-max'), values[1]);
            }
        })
    };

	/**
     * If one of inputs has been changed, move slider handle
     * @param id {string} slider id
     */
    SliderBox.prototype.addInputListener = function(id){
        var slider = $("#" + id);
        var minInput = slider.siblings(".slider-labels").find(".input-min");
        var maxInput = slider.siblings(".slider-labels").find(".input-max");
        var sliderMin = this._range[0] - 0.005;
        var sliderMax = this._range[1] + 0.005;

        minInput.off("focusout.inputMin").on("focusout.inputMin",function(){
            var currentValue = slider.slider("values")[0];
            var minValue = Number($(this).val());
            var maxValue = Number(maxInput.val());
            var diff = Math.abs(currentValue - minValue);

            if (minValue < maxValue && minValue < sliderMax && minValue >= sliderMin && diff > 0.005){
                slider.slider("values", 0, minValue);
            } else {
                $(this).val(Math.round(currentValue * 100) / 100)
            }
        });

        maxInput.off("focusout.inputMax").on("focusout.inputMax",function(){
            var currentValue = slider.slider("values")[1];
            var minValue = Number(minInput.val());
            var maxValue = Number($(this).val());
            var diff = Math.abs(currentValue - maxValue);
            if (minValue < maxValue && maxValue <= sliderMax && maxValue > sliderMin && diff > 0.005){
                slider.slider("values", 1, maxValue);
            } else {
                $(this).val(Math.round(currentValue * 100) / 100)
            }
        });
    };

    /**
     * It returns the current values of slider handles
     * @returns {Array} current values of the handles
     */
    SliderBox.prototype.getValues = function(){
        return this._values;
    };

	/**
	 * Set value in min input field
     * @param selector {JQuery} jquery selector
     * @param value {number}
     */
    SliderBox.prototype.setInputMin = function(selector, value){
        selector.val(Math.round(value * 100) / 100);
    };

    /**
     * Set value in max input field
     * @param selector {JQuery} jquery selector
     * @param value {number}
     */
    SliderBox.prototype.setInputMax = function(selector, value){
        selector.val(Math.round(value * 100) / 100);
    };

    return SliderBox;
});
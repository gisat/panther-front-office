
import S from 'string';

import ArgumentError from '../../../../error/ArgumentError';
import Histogram from '../../../../util/histogram/Histogram';
import Logger from '../../../../util/Logger';
import Slider from '../../../../util/Slider';
import View from '../../../View';
import viewUtils from '../../../../util/viewUtils';

import './SliderBox.css';

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
let $ = window.$;
class SliderBox extends View {
    constructor(options) {
        super(options);

        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SliderBox", "constructor", "missingBoxId"));
        }
        if (!options.name) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SliderBox", "constructor", "missingBoxName"));
        }
        if (!options.target) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SliderBox", "constructor", "missingTarget"));
        }

        this._id = options.id;
        this._name = options.name;
        this._target = options.target;
        this._step = options.step || 1;
        this._range = options.range;
        this._values = options.values;
        this._isRange = options.isRange;

        if (options.units) {
            this._name = this._name + " (" + options.units + ")";
        }

        this.build();
    };

    /**
     * Build the SelectBox and add a listener to it
     */
    build() {
        if (this._isRange) {
            this.buildRange();
        } else {
            this.buildSingle();
        }
    };

    buildSingle() {
        let self = this;
        let html = S(`
        <div class="floater-row slider-box">
            <div class="floater-row slider-caption">
                <span>{{name}}</span>
            </div>
            <div class="floater-row slider-row" id="{{id}}"></div>
            <div class="floater-row slider-labels">
                <div class="slider-labels-min">{{labelMin}}</div>
                <div class="slider-thresholds slider-thresholds-single">
                    <input class="input-single" title="value" type="text" value="{{thresholdMax}}"/>
                </div>
                <div class="slider-labels-max">{{labelMax}}</div>
            </div>
        </div>
        `).template({
            id: this._id,
            name: this._name,
            labelMin: viewUtils.numberFormat(this._range[0], true, 2),
            labelMax: viewUtils.numberFormat(this._range[1], true, 2),
            thresholdMax: Math.round(this._values[0] * 100) / 100
        }).toString();

        this._target.append(html).ready(function () {
            self._slider = self.buildSlider();
            self.addSlideListeners(self._id, self._isRange);
            self.addSingleInputListener(self._id);
        });
    };

    buildRange() {
        let self = this;
        let html = S(`
        <div class="floater-row slider-box">
            <div class="floater-row slider-caption">
                <span>{{name}}</span>
            </div>
            <div class="floater-row slider-row" id="{{id}}"></div>
            <div class="floater-row slider-labels">
                <div class="slider-labels-min">{{labelMin}}</div>
                <div class="slider-thresholds slider-thresholds-min">
                    <input class="input-min" title="min" type="text" value="{{thresholdMin}}"/>
                </div>
                <div class="slider-thresholds slider-thresholds-max">
                    <input class="input-max" title="max" type="text" value="{{thresholdMax}}"/>
                </div>
                <div class="slider-labels-max">{{labelMax}}</div>
            </div>
            <div class="slider-popup" id="{{id}}-popup">
                <div class="histogram" id="histogram-{{id}}">
                </div>
            </div>
        </div>
        `).template({
            id: this._id,
            name: this._name,
            labelMin: viewUtils.numberFormat(this._range[0], true, 2),
            labelMax: viewUtils.numberFormat(this._range[1], true, 2),
            thresholdMin: Math.round(this._range[0] * 100) / 100,
            thresholdMax: Math.round(this._range[1] * 100) / 100
        }).toString();

        this._target.append(html).ready(function () {
            self._slider = self.buildSlider();
            self.histogram = self.buildHistogram();
            self.addSlideListeners(self._id, self._isRange);
            self.addInputListener(self._id);
        });
    };

    /**
     * @returns {string} id
     */
    getSliderId() {
        return this._id;
    };

    /**
     * It builds the slider
     * @returns {Slider}
     */
    buildSlider() {
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
    buildHistogram() {
        return new Histogram({
            id: this._id,
            minimum: this._range[0],
            maximum: this._range[1]
        });
    };

    /**
     * Set the width of the popup
     */
    rebuildPopup() {
        let slider = $("#" + this._id);
        let sliderWidth = slider.length ? slider[0].offsetWidth : null;
        slider.siblings(".slider-popup").css("width", sliderWidth);
    };

    /**
     * Add listener to slider and remove the old one
     * @param id {string}
     * @param isRange {boolean} true, if slider has two handles
     */
    addSlideListeners(id, isRange) {
        let self = this;
        let selector = $("#" + id);

        selector.off('slidestop');
        selector.on('slidestop', function (e) {
            if (isRange) {
                self._values = $(this).slider("values");
                self.setInputValue($(this).siblings().find('.input-min'), self._values[0]);
                self.setInputValue($(this).siblings().find('.input-max'), self._values[1]);
            }
            else {
                self._value = $(this).slider("value");
            }
        });

        selector.off('slide').on('slide', function (e, ui) {
            if (isRange) {
                let values = $(this).slider("values");
                if (values[0] !== values[1]) {
                    self.histogram.selectBars(values);
                }
                self.setInputValue($(this).siblings().find('.input-min'), values[0]);
                self.setInputValue($(this).siblings().find('.input-max'), values[1]);
            } else {
                self.setInputValue($(this).siblings().find('.input-single'), ui.value);
            }
        });
    };

    /**
     * If one of inputs has been changed, move slider handle
     * @param id {string} slider id
     */
    addInputListener(id) {
        let slider = $("#" + id);
        let minInput = slider.siblings(".slider-labels").find(".input-min");
        let maxInput = slider.siblings(".slider-labels").find(".input-max");
        let sliderMin = this._range[0] - 0.005;
        let sliderMax = this._range[1] + 0.005;

        let self = this;
        minInput.off("focusout.inputMin").on("focusout.inputMin", function () {
            self.onMinInputChange(this, slider, minInput, maxInput, sliderMin, sliderMax);
        });
        minInput.keypress(function (e) {
            if (e.which === 13) {
                self.onMinInputChange(this, slider, minInput, maxInput, sliderMin, sliderMax);
            }
        });

        maxInput.off("focusout.inputMax").on("focusout.inputMax", function () {
            self.onMaxInputChange(this, slider, minInput, maxInput, sliderMin, sliderMax);
        });
        maxInput.keypress(function (e) {
            if (e.which === 13) {
                self.onMaxInputChange(this, slider, minInput, maxInput, sliderMin, sliderMax);
            }
        });
    };

    /**
     * If an input has been changed, move slider handle
     * @param id {string} slider id
     */
    addSingleInputListener(id) {
        let slider = $("#" + id);
        let input = slider.siblings(".slider-labels").find(".input-single");

        let self = this;
        input.off("focusout.inputSingle").on("focusout.inputSingle", function () {
            self.onSingleInputChange(this, slider, input);
        });
        input.keypress(function (e) {
            if (e.which === 13) {
                self.onSingleInputChange(this, slider, input);
            }
        });
    };

    onMaxInputChange(target, slider, minInput, maxInput, sliderMin, sliderMax) {
        let currentValue = slider.slider("values")[1];
        let minValue = Number(minInput.val());
        let maxValue = Number($(target).val());
        let diff = Math.abs(currentValue - maxValue);
        if (minValue < maxValue && maxValue <= sliderMax && maxValue > sliderMin && diff > 0.005) {
            slider.slider("values", 1, maxValue);
        } else {
            $(target).val(Math.round(currentValue * 100) / 100)
        }
    };

    onMinInputChange(target, slider, minInput, maxInput, sliderMin, sliderMax) {
        let currentValue = slider.slider("values")[0];
        let minValue = Number($(target).val());
        let maxValue = Number(maxInput.val());
        let diff = Math.abs(currentValue - minValue);

        if (minValue < maxValue && minValue < sliderMax && minValue >= sliderMin && diff > 0.005) {
            slider.slider("values", 0, minValue);
        } else {
            $(target).val(Math.round(currentValue * 100) / 100)
        }
    };

    onSingleInputChange(target, slider, input) {
        let currentValue = slider.slider("value");
        let value = Number(input.val());

        // TODO not only for range from 0 to 100
        if (value <= 100 && 0 <= value) {
            slider.slider("value", value);
        } else {
            $(target).val(Math.round(currentValue * 100) / 100)
        }
    };

    /**
     * It returns the current values of slider handles
     * @returns {Array} current values of the handles
     */
    getValues() {
        return this._values;
    };

    /**
     * It returns the current value of slider handle
     * @returns {number} current value of the handle
     */
    getValue() {
        return this._value;
    };

    /**
     * Set value in input field
     * @param selector {JQuery} jquery selector
     * @param value {number}
     */
    setInputValue(selector, value) {
        selector.val(Math.round(value * 100) / 100);
    };
}

export default SliderBox;
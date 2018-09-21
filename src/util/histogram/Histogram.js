
import _ from 'underscore';

import ArgumentError from '../../error/ArgumentError';
import Logger from '../Logger';
import NotFoundError from '../../error/NotFoundError';

import './Histogram.css';

/**
 * This class builds the histogram from data according to given number of classes
 * @param options {Object}
 * @param options.id {String} Id of connected slider
 * @param options.maximum {number} Maximal value
 * @param options.minimum {number} Minimal value
 * @constructor
 */
let $ = window.$;
const DEFAULT_HISTOGRAM_HEIGHT = 50;

class Histogram {
    constructor(options) {
        if (!options.id) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingElementId"));
        }
        if (!options.minimum && options.minimum !== 0) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingMinimum"));
        }
        if (!options.maximum && options.maximum !== 0) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingMaximum"));
        }

        this._id = options.id;
        this._minimum = options.minimum;
        this._maximum = options.maximum;

        this._classes = null;
        this._numOfClasses = null;
        this._histogram = $('#histogram-' + this._id);
        if (this._histogram.length === 0) {
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingHTMLelement"));
        }
    };

    /**
     * Rebuild the histogram for given dataset
     * @param distribution {Array} Distribution of data
     * @param sliderRange {Array} Current values of slider handles
     * @param dataMinMax {Array} Minimum and maximum of data
     */
    rebuild(distribution, sliderRange, dataMinMax) {
        if (this._classes) {
            this._classes = this.emptyClasses(this._classes);
        }
        this._classes = this.buildClasses(distribution, dataMinMax);
        this.redraw(distribution, dataMinMax);
        this.selectBars(sliderRange);
    };

    /**
     * Build the histogram classes (thresholds and frequency for each class)
     * @param distribution {Array} Distribution of original data
     * @param range {Array} Min and max value of the original data
     * @returns {Array.<{minimum: number, maximum: number, count: number}>} Histogram classes
     */
    buildClasses(distribution, range) {
        this._numOfClasses = distribution.length;
        let classes = [];
        let threshold = range[0];
        let interval = (range[1] - range[0]) / this._numOfClasses;

        for (let i = 0; i < this._numOfClasses; i++) {
            classes[i] = {
                minimum: threshold,
                count: distribution[i]
            };
            threshold += interval;
            classes[i].maximum = threshold;
        }
        return classes;
    };

    /**
     * Redraw the histogram
     * @param frequencies {Array} Distribution of original data
     * @param dataMinMax {Array} Minimum and maximum value of data
     */
    redraw(frequencies, dataMinMax) {
        let widthRatio = (dataMinMax[1] - dataMinMax[0]) / (this._maximum - this._minimum);
        if (Math.abs(dataMinMax[1] - dataMinMax[0]) < 0.01) {
            widthRatio = 0.05;
        }

        let slider = this._histogram.parents(".slider-box").find(".slider-row")[0];

        let containerHeight = this._histogram[0].offsetHeight || DEFAULT_HISTOGRAM_HEIGHT;
        let containerWidth = slider.offsetWidth;

        let width = widthRatio * (containerWidth - 2) / this._numOfClasses;
        let heightRatio = containerHeight / this.getMostFrequented(this._classes);
        let histogramMargin = (dataMinMax[0] - this._minimum) * (containerWidth / (this._maximum - this._minimum));

        let content = "";
        this._classes.forEach(function (bar) {
            let height = (bar.count * heightRatio);
            if (height < 1 && height > 0){
            	height = 1;
			}
            let marginTop = containerHeight - height;
            content += '<div class="histogram-bar selected" style="height: ' + height + 'px ; width: ' + width + 'px ;margin-top: ' + marginTop + 'px"></div>';
        });

        this._histogram.html('').append(content).css({
            marginLeft: histogramMargin
        });
    };

    /**
     * It clears counts for all classes
     * @param classes {Array}
     */
    emptyClasses(classes) {
        classes.forEach(function (klass) {
            klass.count = 0;
        });
        return classes;
    };

    /**
     * It returns the count for a class with highest frequency
     * @param {Array} classes
     * @returns {number}
     */
    getMostFrequented(classes) {
        return _.max(classes, function (item) {
            return item.count;
        }).count;
    };

    /**
     * It redraws colour of histogram bars according to slider position
     * @param values {Array} current min and max value of the slider
     */
    selectBars(values) {
        let minIndex = -1;
        let maxIndex = this._numOfClasses;
        if (this._classes) {
            this._classes.forEach(function (klass, index) {
                if (klass.maximum < values[0]) {
                    if (index > minIndex) {
                        minIndex = index;
                    }
                }
                if (klass.minimum > values[1]) {
                    if (index < maxIndex) {
                        maxIndex = index;
                    }
                }
            });

            this._histogram.children().each(function (index, bar) {
                if (index <= minIndex || index >= maxIndex) {
                    $(bar).removeClass('selected');
                }
                else {
                    $(bar).addClass('selected');
                }
            });
        }
    };
}

export default Histogram;
define(['../../error/ArgumentError',
        '../Logger',
        '../../error/NotFoundError',
        '../../util/viewUtils',

        'jquery',

        'css!./Histogram'
], function (ArgumentError,
             Logger,
             NotFoundError,
             viewUtil,

             $) {
    "use strict";

    /**
     * This class builds the histogram from data according to given number of classes
     * @param options {Object}
     * @param options.id {String} Id of connected slider
     * @param options.maximum {number} Maximal value
     * @param options.minimum {number} Minimal value
     * @constructor
     */
    var Histogram = function(options) {
        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingElementId"));
        }
        if (!options.minimum && options.minimum != 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingMinimum"));
        }
        if (!options.maximum && options.maximum != 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingMaximum"));
        }

        this._id = options.id;
        this._minimum = options.minimum;
        this._maximum = options.maximum;

        this._classes = null;
        this._numOfClasses = null;
        this._histogram = $('#histogram-' + this._id);
        if (this._histogram.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingHTMLelement"));
        }
    };

    /**
     * Rebuild the histogram for given dataset
     * @param distribution {Array} Distribution of data
     * @param sliderRange {Array} Current values of slider handles
     * @param dataMinMax {Array} Minimum and maximum of data
     */
    Histogram.prototype.rebuild = function(distribution, sliderRange, dataMinMax){
        if (this._classes){
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
    Histogram.prototype.buildClasses = function(distribution, range){
        this._numOfClasses = distribution.length;
        var classes = [];
        var threshold = range[0];
        var interval = (range[1] - range[0])/this._numOfClasses;

        for (var i = 0; i < this._numOfClasses; i++){
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
    Histogram.prototype.redraw = function(frequencies, dataMinMax) {
        var widthRatio = (dataMinMax[1] - dataMinMax[0])/(this._maximum - this._minimum);
        if (Math.abs(dataMinMax[1] - dataMinMax[0]) < 0.01){
            widthRatio = 0.05;
        }
        var containerHeight = this._histogram.height();
        var containerWidth = this._histogram.parents(".slider-popup").width();

        var width = widthRatio * (containerWidth - 2)/this._numOfClasses;
        var heightRatio = containerHeight/this.getMostFrequented(this._classes);
        var histogramMargin = (dataMinMax[0] - this._minimum) * (containerWidth/(this._maximum - this._minimum));

        var content = "";
        this._classes.forEach(function(bar){
            var height = (bar.count * heightRatio);
            var marginTop = containerHeight - height;
            content += '<div class="histogram-bar selected" style="height: ' + height + 'px ; width: ' + width + 'px ;margin-top: '+ marginTop +'px"></div>';
        });

        this._histogram.html('').append(content).css({
            marginLeft: histogramMargin
        });
    };

	/**
     * It clears counts for all classes
     * @param classes {Array}
     */
    Histogram.prototype.emptyClasses = function(classes) {
        classes.forEach(function(klass){
            klass.count = 0;
        });
        return classes;
    };

	/**
     * It returns the count for a class with highest frequency
     * @param {Array} classes
     * @returns {number}
     */
    Histogram.prototype.getMostFrequented = function(classes) {
        return _.max(classes, function(item) {
            return item.count;
        }).count;
    };

    /**
     * It redraws colour of histogram bars according to slider position
     * @param values {Array} current min and max value of the slider
     */
    Histogram.prototype.selectBars = function(values) {
        var minIndex = -1;
        var maxIndex = this._numOfClasses;
        if (this._classes){
            this._classes.forEach(function(klass, index){
                if (klass.maximum < values[0]){
                    if (index > minIndex){
                        minIndex = index;
                    }
                }
                if (klass.minimum > values[1]){
                    if (index < maxIndex){
                        maxIndex = index;
                    }
                }
            });

            this._histogram.children().each(function(index, bar){
                if (index <= minIndex || index >=  maxIndex){
                    $(bar).removeClass('selected');
                }
                else {
                    $(bar).addClass('selected');
                }
            });
        }
    };

    return Histogram;
});
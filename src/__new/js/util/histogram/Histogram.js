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
        this.redraw(distribution, sliderRange, dataMinMax);
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
     * @param sliderRange {Array.<number,number>} Current values of slider handles
     * @param dataMinMax {Array} Minimum and maximum value of data
     */
    Histogram.prototype.redraw = function(frequencies, sliderRange, dataMinMax) {
        var widthRatio = (dataMinMax[1] - dataMinMax[0])/(this._maximum - this._minimum);
        if (Math.abs(dataMinMax[1] - dataMinMax[0]) < 0.01){
            widthRatio = 0.05;
        }
        var containerHeight = this._histogram.height();
        var containerWidth = this._histogram.parents(".slider-popup").width();
        var originalBarWidth = widthRatio*(containerWidth - 2)/this._numOfClasses;

        if (originalBarWidth <= 8){
            this._numOfReadyClasses = this.adjustNumberOfClasses(this._numOfClasses, originalBarWidth);
            this._readyClasses = this.groupClasses(this._numOfReadyClasses, this._classes);
        }
        else {
            this._numOfReadyClasses = this._numOfClasses;
            this._readyClasses = this._classes;
        }
        var width = widthRatio * (containerWidth - 2)/this._numOfReadyClasses;
        var heightRatio = containerHeight/this.getMostFrequented(this._readyClasses);
        var histogramMargin = (dataMinMax[0] - this._minimum) * (containerWidth/(this._maximum - this._minimum));

        var content = "";
        this._readyClasses.forEach(function(bar){
            var height = (bar.count * heightRatio);
            var marginTop = containerHeight - height;
            content += '<div class="histogram-bar selected" style="height: ' + height + 'px ; width: ' + width + 'px ;margin-top: '+ marginTop +'px"></div>';
        });

        this._histogram.html('').append(content).css({
            marginLeft: histogramMargin
        });
    };

	/**
	 * Group the classes, if the number of original classes is divisible by the number of new classes
     * @param numClasses {number} Number of resulting classes
     * @param originalClasses {Array}
     * @returns {Array} grouped classes
     */
    Histogram.prototype.groupClasses = function(numClasses, originalClasses){
        var groupedClasses = [];
        var classesInGroup = originalClasses.length/numClasses;
        if (originalClasses.length % numClasses == 0){
            for (var k = 0; k < numClasses; k++){
                var sum = 0;
                var l = 0;
                for (l; l < classesInGroup; l++ ){
                    sum = sum + originalClasses[k*classesInGroup + l].count;
                }
                groupedClasses[k] = {};
                groupedClasses[k].minimum = originalClasses[k*classesInGroup].minimum;
                groupedClasses[k].maximum = originalClasses[(k*classesInGroup + l) - 1].maximum;
                groupedClasses[k].count = sum;
            }
            return groupedClasses;
        }
        else {
            return originalClasses;
        }
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
	 * Adjust the number of classes of histogram. It prevents histogram from having thin bars.
     * @param originalWidth {number} Width of bar in pixels
     * @param num {number} original number of classes
     * @returns {number} number of classes
     */
    Histogram.prototype.adjustNumberOfClasses = function(num, originalWidth){
        var adjustedNumOfClasses = num;

        if (num % 20 == 0){
            if (originalWidth > 5 && originalWidth <= 8){
                adjustedNumOfClasses = num/2;
            }
            else if (originalWidth > 3 && originalWidth <= 5){
                adjustedNumOfClasses = num/4;
            }
            else if (originalWidth > 1.5 && originalWidth <= 3){
                adjustedNumOfClasses = num/5;
            }
            else if (originalWidth > .8 && originalWidth <= 1.5){
                adjustedNumOfClasses = num/10;
            }
            else {
                adjustedNumOfClasses = num/20;
            }
        }
        return adjustedNumOfClasses;
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
        var maxIndex = this._numOfReadyClasses;
        if (this._readyClasses){
            this._readyClasses.forEach(function(klass, index){
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
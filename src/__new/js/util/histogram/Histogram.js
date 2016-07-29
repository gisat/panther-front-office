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
     * @param options.numClasses {number} Number of classes in which will be the data divided
     * @param options.maximum {number} Maximal value
     * @param options.minimum {number} Minimal value
     * @constructor
     */
    var Histogram = function(options) {
        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingElementId"));
        }
        if (!options.numClasses){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingNumClasses"));
        }
        if (!viewUtil.isNaturalNumber(options.numClasses)){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "notNaturalNumber"));
        }
        if (!options.minimum && options.minimum != 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingMinimum"));
        }
        if (!options.maximum && options.maximum != 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingMaximum"));
        }

        this._id = options.id;
        this._numClasses = options.numClasses;
        this._minimum = options.minimum;
        this._maximum = options.maximum;

        this._classes = this.buildClasses();

        this._histogram = $('#histogram-' + this._id);
        if (this._histogram.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Histogram", "constructor", "missingHTMLelement"));
        }
    };

    /**
     * Rebuild the histogram for given dataset
     * @param dataSet {JSON}
     */
    Histogram.prototype.rebuild = function(dataSet){
        this.emptyClasses();

        var self = this;
        dataSet.forEach(function(item){
            var value = item.data[self._id].value;
            self._classes.forEach(function(klass){
                if (value >= klass.minimum && value <= klass.maximum){
                    return klass.count +=1;
                }
            });
        });
        this.redraw();
    };

    /**
     * Redraw the histogram
     */
    Histogram.prototype.redraw = function() {
        this._histogram.html('');
        var containerHeight = this._histogram.css('height').slice(0,-2);
        var containerWidth = this._histogram.css('width').slice(0,-2);
        var width = (containerWidth - 1)/this._numClasses;
        var heightRatio = containerHeight/this.getMostFrequented();
        var content = "";

        this._classes.forEach(function(bar){
            var height = (bar.count * heightRatio);
            var margin = containerHeight - height;
            content += '<div class="histogram-bar selected" style="height: ' + height + 'px ; width: ' + width + 'px ;margin-top: '+ margin +'px"></div>';
        });

        this._histogram.append(content);
    };

    /**
     * It redraws colour of histogram bars according to slider position
     * @param values {Array} min and max value
     */
    Histogram.prototype.selectBars = function(values) {
        var minIndex = -1;
        var maxIndex = this._numClasses;
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
    };

    /**
     * It returns classes for histogram and their thresholds
     * @returns {Object}
     */
    Histogram.prototype.buildClasses = function() {
        var classes = [];

        var threshold = this._minimum;
        var interval = (this._maximum - this._minimum)/this._numClasses;

        for (var i = 0; i < this._numClasses; i++){
            classes[i] = {
                minimum: threshold,
                count: 0
            };
            threshold += interval;
            classes[i].maximum = threshold;
        }
        return classes;
    };

    /**
     * It clears counts for all classes
     */
    Histogram.prototype.emptyClasses = function() {
        this._classes.forEach(function(klass){
            klass.count = 0;
        });
    };

    /**
     * It returns the count for a class with highest frequency
     * @returns {number}
     */
    Histogram.prototype.getMostFrequented = function() {
        return _.max(this._classes, function(item) {
            return item.count;
        }).count;
    };

    return Histogram;
});
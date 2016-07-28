define(['jquery'], function ($) {

    /**
     * Class for data filtering
     * @constructor
     */
    var DataFilters = function(){
    };

    /**
     * Filter whole dataset according to several filter inputs
     * @param data {JSON}
     * @param inputs {Object}
     * @param inputs.checkboxes [Array] List of checkboxes for filtering
     * @param inputs.sliders [Array] List of sliders for filtering
     * @param inputs.selects [Array] List of select inputs for filtering
     * @returns {JSON} filtered data
     */
    DataFilters.prototype.filter = function(data, inputs){
        // deep copy of the object
        data = $.extend(true, {}, data);
        var self = this;
        for (var key in inputs){
            if (inputs.hasOwnProperty(key)){
                if (key == "checkboxes"){
                    inputs.checkboxes.forEach(function(item){
                        var value = item.isChecked();
                        data = self.compare(data, item._id, value);
                    });
                }
                else if (key == "sliders") {
                    inputs.sliders.forEach(function(item){
                        var thresholds = item.getValues();
                        data = self.isBetween(data, item._id, thresholds);
                    });
                }
                else if (key == "selects") {
                    inputs.selects.forEach(function(item){
                        var value = item.getValue();
                        data = self.compare(data, item._id, value);
                    });
                }
            }
        }
        return data;
    };

    /**
     * Filter data by attribute according to given attribute value
     * @param dataSet {JSON} All data for filtering has to be placed in the data property
     * @param attribute {string} key for filtering
     * @param value {*} - filtering conditions
     * @returns {JSON} Filtered data
     */
    DataFilters.prototype.compare = function(dataSet, attribute, value){
        return _.filter(dataSet, function(item){
            return item.data[attribute].value == value;
        });
    };

    /**
     * It returns minimal and maximal value of some property placed in data
     * @param dataSet {JSON} All data for filtering has to be placed in the data property
     * @param attribute {string} key for filtering
     * @returns {Array} minimal and maximal value
     */
    DataFilters.prototype.getMinMax = function(dataSet, attribute) {
        var max = _.max(dataSet, function(item){
            return item.data[attribute].value;
        }).data[attribute].value;

        var min = _.min(dataSet, function(item){
            return item.data[attribute].value;
        }).data[attribute].value;

        return [min,max];
    };

    /**
     * It returns an array of unique values of some property placed in data
     * @param dataSet {JSON} All data for filtering has to be placed in the data property
     * @param attribute {string} key for filtering
     * @returns {Array} unique values
     */
    DataFilters.prototype.getUniqueValues = function(dataSet, attribute){
        var values = _.map(dataSet, function (item) {
            return item.data[attribute].value;
        });
        return _.uniq(values);
    };

    /**
     * Filter data by attribute according to given thresholds
     * @param dataSet {JSON} All data for filtering has to be placed in the data property
     * @param attribute {string} key for filtering
     * @param thresholds {Array} - min and max value
     * @returns {JSON} Filtered data
     */
    DataFilters.prototype.isBetween = function (dataSet, attribute, thresholds){
        return _.filter(dataSet, function(item){
            return item.data[attribute].value >= thresholds[0] && item.data[attribute].value <= thresholds[1];
        });
    };

    return DataFilters;
});
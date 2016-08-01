define([], function () {
    "use strict";
    /**
     * Class for data grouping
     * @param options {Object}
     * @param options.groupingOptions {Array} According to options will be the data grouped
     * @constructor
     */
    var DataGrouping = function(options){
        this._options = options.groupingOptions;
        this._classes = this.buildClasses();
    };

    /**
     * It prepares one class per uniqe attribute value
     * @returns {Array} Array items are objects with two properties - name (property value), count (number of features with this name)
     */
    DataGrouping.prototype.buildClasses = function(){
        var classes = [];
        this._options.forEach(function(item){
            var record = {
                name: item,
                count: 0
            };
            classes.push(record);
        });

        return classes;
    };

    /**
     * It clears counts for all classes
     */
    DataGrouping.prototype.emptyClasses = function(){
        this._classes.forEach(function(klass){
            klass.count = 0;
        });
    };

    /**
     * Go through data and count the occurrences for particular attribute values
     * @param dataSet {JSON}
     * @param key {string} key of property for grouping
     */
    DataGrouping.prototype.groupData = function(dataSet, key){
        this.emptyClasses();
        var self = this;
        dataSet.forEach(function(item){
            var value = item.data[key].value;
            self._classes.forEach(function(klass){
                if (value == klass.name){
                    return klass.count +=1;
                }
            });
        });

        return this._classes;
    };

    return DataGrouping;
});
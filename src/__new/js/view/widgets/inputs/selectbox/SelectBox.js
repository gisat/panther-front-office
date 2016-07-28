define(['../../../../error/ArgumentError',
        '../../../../util/Logger',
        '../../../../error/NotFoundError',
        '../../../View',

        'jquery',
        'string',

        'text!./SelectBox.html',
        'css!./SelectBox'
], function (ArgumentError,
             Logger,
             NotFoundError,
             View,

             $,
             S,

             htmlContent) {
    "use strict";

    /**
     * This class represents the row with the select box
     * @param options {Object}
     * @param options.id {string} ID of the select box
     * @param options.name {string} Select box label
     * @param options.target {Object} JQuery selector representing the target element where should be the select box rendered
     * @param options.data
     * @constructor
     */
    var SelectBox = function(options) {
        View.apply(this, arguments);

        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingSelectBoxId"));
        }
        if (!options.name){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingSelectBoxName"));
        }
        if (!options.target){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingTarget"));
        }
        if (options.target.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "SelectBox", "constructor", "missingHTMLElement"));
        }

        this._id = options.id;
        this._name = options.name;
        this._target = options.target;
        this._data = options.data;

        this.build();
        this._classes = this.prepareClasses();
    };

    SelectBox.prototype = Object.create(View.prototype);

    /**
     * Build the checkbox row and add a listener to it
     */
    SelectBox.prototype.build = function (){

        var html = S(htmlContent).template({
            id: this._id,
            name: this._name
        }).toString();

        this._target.append(html);

        var content = "";
        this._data.forEach(function(item){
            content += '<option>' + item + '</option>';
        });
        $('#' + this._id).append(content).selectmenu();
    };

    /**
     * It returns the name of currently selected
     * @returns {string} selected value
     */
    SelectBox.prototype.getValue = function(){
        return $('#' + this._id).selectmenu().val();
    };

    /**
     * It adds the listener to selectmenu. After opening the menu, the occurencies of attribute values are counted in currently filtered data
     * @param dataSet
     */
    SelectBox.prototype.addSelectOpenListener = function(dataSet){
        var self = this;
        this.emptyClasses();
        this.groupData(dataSet);

        $('#' + this._id).off("selectmenuopen")
            .on( "selectmenuopen", function() {
                $('#' + self._id + '-menu li > div').each(function(index, item){
                    var text = $(this).text().split(" ")[0];
                    $(this).html('');
                    $(this).append(text + '<i class="option-count"> ' + self._classes[index].count + '</i>');
                });
                $('#' + self._id + '-menu').css("display","none").slideDown( "fast" );
            })
    };

    /**
     * It prepares one class per uniqe attribute value
     * @returns {Array} Array items are objects with two properties - name (property value), count (number of features with this name)
     */
    SelectBox.prototype.prepareClasses = function(){
        var classes = [];
        this._data.forEach(function(item){
            var record = {
                name: item,
                count: 0
            };
            classes.push(record);
        });

        return classes;
    };

    /**
     * Go through data and count the occurencies of particular attribute values
     * @param dataSet {JSON}
     */
    SelectBox.prototype.groupData = function(dataSet){
        var self = this;

        dataSet.forEach(function(item){
            var value = item.data[self._id].value;
            self._classes.forEach(function(klass){
                if (value == klass.name){
                    return klass.count +=1;
                }
            });
        });
    };

    /**
     * It clears counts for all classes
     */
    SelectBox.prototype.emptyClasses = function(){
        this._classes.forEach(function(klass){
            klass.count = 0;
        });
    };

    return SelectBox;
});
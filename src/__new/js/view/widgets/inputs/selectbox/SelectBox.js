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
     * @param options.data {Array} Select options
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

    return SelectBox;
});
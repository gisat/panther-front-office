define([
    '../../../../error/ArgumentError',
    '../../../../error/NotFoundError',
    '../../inputs/checkbox/Checkbox',
    '../../../../util/Logger',

    'jquery',
    'string',

    'text!./Settings.html'
], function (ArgumentError,
             NotFoundError,
             Checkbox,
             Logger,

             $,
             S,

             htmlContent) {

    /**
     * It builds the settings window and control all operations in it
     * @params options {Object}
     * @params options.dataSet {JSON} Data set
     * @params options.target {Object} JQuery - target object, where should be the settings rendered
     * @params options.widgetId {string} Id of the connected widget
     * @constructor
     */
    var Settings = function(options){
        if (!options.widgetId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Settings", "constructor", "missingWidgetId"));
        }

        this._dataSet = options.dataSet;
        this._target = options.target;
        this._widgetId = options.widgetId;
        this._id = options.widgetId + '-settings';

        this._categories = {};
        this.build();
    };

    /**
     * Build the settings window, fill it with data and add listeners
     */
    Settings.prototype.build = function(){
        var html = S(htmlContent).template({id: this._id}).toString();
        this._target.append(html);

        this.addCategories();
        this.addCloseListener();
        this.addConfirmListener();
    };

    /**
     * It returns the dialog confirm button object
     * @returns {*|jQuery|HTMLElement}
     */
    Settings.prototype.getConfirmButton = function(){
        return $("#" + this._id + " .settings-confirm");
    };

    /**
     * Add the category for filtering
     */
    Settings.prototype.addCategories = function(){
        this._checkboxTarget = $('#' + this._id + ' .tool-window-body');
        var data = this._dataSet[0].data;

        for (var key in data){
            if (data.hasOwnProperty(key)){
                var value = data[key].value;
                var name = data[key].name;
                var input = "";

                if (typeof value == "boolean"){
                    input = "checkbox";
                }
                else if (typeof value == "number") {
                    input = "slider";
                }
                else if (typeof value == "string") {
                    input = "select";
                }

                this.addCheckbox(key, name);
                this._categories[key] = {
                    name: name,
                    input: input,
                    active: true
                };
            }
        }
    };

    /**
     * It returns the checkbox row
     * @param key {string} id of the checkbox row
     * @param name {string} label
     * @returns {Checkbox}
     */
    Settings.prototype.addCheckbox = function(key, name){
        return new Checkbox({
            containerId: this._id,
            checked: true,
            dataId: key,
            id: 'settings-' + key,
            name: name,
            target: this._checkboxTarget
        });
    };

    /**
     * It returns selected filters
     * @returns {Object}
     */
    Settings.prototype.getCategories = function(){
        return this._categories;
    };

    /**
     * Close the settings window
     */
    Settings.prototype.addCloseListener = function(){
        var self = this;
        $('#' + this._id + ' .window-close').on("click", function(){
            $('#' + self._id).hide("drop", {direction: "up"}, 200)
                .removeClass("open");
        });
    };

    /**
     * It adds the listener to each checkbox row
     */
    Settings.prototype.addConfirmListener = function(){
        var self = this;
        $('#' + this._id + ' .settings-confirm').on("click", function(){
            $('#' + self._id + ' .checkbox-row').each(function(){
                var checked = $(this).hasClass("checked");
                var id = $(this).attr('data-id');
                self._categories[id].active = checked;
            });
            $('#' + self._id).hide("drop", {direction: "up"}, 200)
                .removeClass("open");
        });
    };

    return Settings;
});
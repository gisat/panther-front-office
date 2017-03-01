define(['../../../../error/ArgumentError',
        '../../../../util/Logger',
        '../../../View',

        'jquery',
        'string',

        'text!./Checkbox.html',
        'css!./Checkbox'
], function (ArgumentError,
             Logger,
             View,

             $,
             S,

             htmlContent) {
    "use strict";

    /**
     * This class represents the row with the checkbox
     * @param options {Object}
     * @param options.containerId {string} id of container
     * @param options.checked {boolean} true, if checkbox is checked
     * @param options.dataId {string}
     * @param options.id {string} ID of the checkbox
     * @param options.class {string} Class of the checkbox
     * @param options.parentCheckbox {string} id of the parent checkbox
     * @param options.name {string} Checkbox label
     * @param options.target {Object} JQuery object representing the target element where should be the checkbox rendered
     * @constructor
     */
    var Checkbox = function(options) {
        View.apply(this, arguments);
        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Checkbox", "constructor", "missingBoxId"));
        }
        if (!options.name){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Checkbox", "constructor", "missingBoxName"));
        }
        if (!options.target){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Checkbox", "constructor", "missingTarget"));
        }

        this._checked = options.checked || false;
        this._dataId = options.dataId || options.id;
        this._id = options.id;
        this._name = options.name;
        this._target = options.target;
        this._containerId = options.containerId;

        this._class = "";
        if (options.hasOwnProperty("class")){
            this._class = options.class;
        }

        this._parentCheckbox = "";
        if (options.hasOwnProperty("parentCheckbox")){
            this._parentCheckbox = options.parentCheckbox;
        }

        this.build();
    };

    Checkbox.prototype = Object.create(View.prototype);

    /**
     * Build the checkbox row and add a listener to it
     */
    Checkbox.prototype.build = function (){

        var html = S(htmlContent).template({
            id: this._id,
            class: this._class,
            dataId: this._dataId,
            name: this._name
        }).toString();

        this._target.append(html);

        if (this._checked){
            $("#" + this._id).addClass("checked");
        }

        if (this._parentCheckbox){
            $("#" + this._id).attr("data-parent-checkbox", this._parentCheckbox);
        }

        this.addListeners(this._id);
    };

    /**
     * It returns true if chceckbox is checked
     * @returns {*|jQuery}
     */
    Checkbox.prototype.isChecked = function(){
        return $("#" + this._id).hasClass('checked');
    };

    /**
     * It returns checkbox row element
     * @returns {*|jQuery}
     */
    Checkbox.prototype.getCheckbox = function(){
        return $("#" + this._id);
    };

    /**
     * Add listener to checkbox row and remove the old one
     * @param id {string} ID of the checkbox
     */
    Checkbox.prototype.addListeners = function(id){
        var self = this;
        var selector = $("#" + this._containerId);
        selector.off('click.' + id);
        selector.on('click.' + id, '#' + id, function(e){
            if (!self.specialKeyPressed(e)){
                $('#' + id).toggleClass('checked');
            }
        })
    };

    return Checkbox;
});
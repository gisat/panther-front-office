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
     * @params options.attributes {Array} List of all attributes
     * @params options.target {Object} JQuery - target object, where should be the settings rendered
     * @params options.widgetId {string} Id of the connected widget
     * @constructor
     */
    var Settings = function(options){
        if (!options.widgetId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Settings", "constructor", "missingWidgetId"));
        }

        this._attributes = options.attributes;
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
        if (!$("#" + this._id).length){
            this._target.append(html);
        }

        this.addCategories();
        this.addCloseListener();
        this.addConfirmListener();
        this.addDragging();
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
        this._checkboxTarget.html("");
        var asName = "";
        var asId = null;
        var self = this;
        this._attributes.forEach(function(attribute){
            if (attribute.about.asName != asName){
                asName = attribute.about.asName;
                asId = "settings-as-" + attribute.about.as;
                self.addAttributeSetName(asName, asId);
            }
            var type = attribute.about.attrType;
            var name = attribute.about.attrName;
            var id = "attr-" + attribute.about.attr;
            var input = "";

            if (type == "boolean"){
                input = "checkbox";
            }
            else if (type == "numeric") {
                input = "slider";
            }
            else if (type == "text") {
                input = "select";
            }

            self.addAttribute(id, name);
            self._categories[id] = {
                attrData: attribute,
                name: name,
                input: input,
                active: true
            };
        });
    };

	/**
     * Add label for attribute set to the settings window
     * @param name {string} name of the attribute set
     * @param id {string} id of the element
     */
    Settings.prototype.addAttributeSetName = function(name, id){
        var html = '<div class="floater-row section-header" id="'+ id +'">' + name + '</div>';
        this._checkboxTarget.append(html);
    };

    /**
     * It returns the checkbox row
     * @param id {string} id of the checkbox row
     * @param name {string} label
     * @returns {Checkbox}
     */
    Settings.prototype.addAttribute = function(id, name){
        return new Checkbox({
            containerId: this._id,
            checked: true,
            dataId: id,
            id: 'settings-' + id,
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
        $('#' + this._id + ' .window-close').off("click").on("click", function(){
            $('#' + self._id).hide("drop", {direction: "up"}, 200)
                .removeClass("open");
        });
    };

    /**
     * It adds the listener to each checkbox row
     */
    Settings.prototype.addConfirmListener = function(){
        var self = this;

        $('#' + this._id + ' .settings-confirm').off("click").on("click", function(){
            $('#' + self._id + ' .checkbox-row').each(function(){
                var checked = $(this).hasClass("checked");
                var id = $(this).attr('data-id');
                self._categories[id].active = checked;
            });
            $('#' + self._id).hide("drop", {direction: "up"}, 200)
                .removeClass("open");
        });
    };

    Settings.prototype.addDragging = function(){
        $("#" + this._id).draggable({
            containment: "body",
            handle: ".tool-window-header",
            stop: function (ev, ui) {
                var element = $(this);
                element.css({
                    width: "",
                    height: ""
                });
            }
        });
    };

    return Settings;
});
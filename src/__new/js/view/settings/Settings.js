define([
    '../../error/ArgumentError',
    '../../error/NotFoundError',
    '../widgets/inputs/checkbox/Checkbox',
    '../../util/Logger',

    'jquery',
    'string',

    'text!./Settings.html',
    'css!./Settings'
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
        this._id = options.widgetId + '-settings';

        this.buildContent();
    };

    /**
     * Build the settings window, fill it with data and add listeners
     */
    Settings.prototype.buildContent = function(){
        var html = S(htmlContent).template({id: this._id}).toString();
        if (!$("#" + this._id).length){
            this._target.append(html);
        }

        this.build();
        this.addCheckboxChangeListener();
        this.addMultiCheckListener();
        this.addCloseListener();
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
     * It returns the checkbox row
     * @param id {string} id of the checkbox row
     * @param name {string} label
     * @param klass {string} additional class for checkbox row
     * @param dataId {string} if present, id of the attribute set row
     * @param checked {boolean} true if checkbox should be checked
     * @returns {Checkbox}
     */
    Settings.prototype.addCheckbox = function(id, name, klass, dataId, checked){
        return new Checkbox({
            containerId: this._id,
            class: klass,
            checked: checked,
            dataId: dataId,
            id: id,
            name: name,
            target: this._settingsBody
        });
    };

    /**
     * Close the settings window
     */
    Settings.prototype.addCloseListener = function(){
        var self = this;
        $('#' + this._id + ' .window-close, #' + this._id + ' .settings-confirm').off("click").on("click", function(){
            $('#' + self._id).hide("drop", {direction: "up"}, 200)
                .removeClass("open");
        });
    };

	/**
     * Check/uncheck whole attribute set or all attributes
     */
    Settings.prototype.addMultiCheckListener = function(){
        var self = this;

        // whole attribute set
        $('#' + this._id + ' .attribute-set-row').off("click.atributeSet").on("click.atributeSet", function(){
            var asCheckbox = $(this);
            var dataId = asCheckbox.attr("data-id");
            var asCheckWas = asCheckbox.hasClass("checked");
            $('#' + self._id + ' .attribute-row').each(function() {
                var attrCheckbox = $(this);
                var arr = attrCheckbox.attr("data-id").split("-");
                var attrDataId = arr[0] + "-" + arr[1];
                if (dataId == attrDataId){
                    var attrCheckState = attrCheckbox.hasClass("checked");
                    if (asCheckWas == attrCheckState){
                        if (attrCheckState){
                            attrCheckbox.removeClass("checked");
                        } else {
                            attrCheckbox.addClass("checked");
                        }
                    }
                }
            });
        });

        // all attributes
        $('#settings-all-attributes').off("click.allattributes").on("click.allattributes", function(){
            var allCheckbox = $(this);
            var allCheckWas = allCheckbox.hasClass("checked");
            $('#' + self._id + ' .checkbox-row').not(this).each(function() {
                var attrCheckbox = $(this);
                var attrCheckState = attrCheckbox.hasClass("checked");
                if (allCheckWas == attrCheckState){
                    if (attrCheckState){
                        attrCheckbox.removeClass("checked");
                    } else {
                        attrCheckbox.addClass("checked");
                    }
                }
            });
        });
    };

	/**
     * Add listener on checkbox change
     */
    Settings.prototype.addCheckboxChangeListener = function(){
        $('#' + this._id).find(".checkbox-row").off("click.changeAttributeState")
            .on("click.changeAttributeState", this.rebuildAttributesState.bind(this));
    };

	/**
     * Enable dragging of settings window
     */
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
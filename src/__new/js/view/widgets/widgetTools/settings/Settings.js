define([
    '../../../../error/ArgumentError',
    '../../../../error/NotFoundError',
    '../../inputs/checkbox/Checkbox',
    '../../../../util/Logger',

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
        this.addMultiCheckListener();
        this.addCheckboxChangeListener();
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
        this._settingsBody = $('#' + this._id + ' .tool-window-body');
        this._settingsBody.html("");
        var asName = "";
        var asId = null;
        var self = this;
        this._attributes.forEach(function(attribute){
            if (attribute.about.attributeSetName != asName){
                asName = attribute.about.attributeSetName;
                asId = "settings-as-" + attribute.about.attributeSet;
                self.addCheckbox(asId, asName, "attribute-set-row", "");
            }
            var type = attribute.about.attributeType;
            var name = attribute.about.attributeName;
            var id = "attr-" + attribute.about.attribute;
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

            self.addCheckbox('settings-' + id, name, "attribute-row", asId);
            self._categories[id] = {
                attrData: attribute,
                name: name,
                input: input,
                active: true
            };
        });
    };

    /**
     * It returns the checkbox row
     * @param id {string} id of the checkbox row
     * @param name {string} label
     * @param klass {string} additional class for checkbox row
     * @param dataId {string} if present, id of the attribute set row
     * @returns {Checkbox}
     */
    Settings.prototype.addCheckbox = function(id, name, klass, dataId){
        return new Checkbox({
            containerId: this._id,
            class: klass,
            checked: true,
            dataId: dataId,
            id: id,
            name: name,
            target: this._settingsBody
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
     * Check/uncheck whole attribute set
     */
    Settings.prototype.addMultiCheckListener = function(){
        var self = this;
        $('#' + this._id + ' .attribute-set-row').off("click").on("click", function(){
            var asCheckbox = $(this);
            var dataId = asCheckbox.attr("data-id");
            var asCheckWas = asCheckbox.hasClass("checked");
            $('#' + self._id + ' .attribute-row[data-id=' + dataId + ']').each(function() {
                var attrCheckbox = $(this);
                var attrCheckState = attrCheckbox.hasClass("checked");
                if (asCheckWas == attrCheckState){
                    if (attrCheckState){
                        attrCheckbox.removeClass("checked");
                    } else {
                        attrCheckbox.addClass("checked");
                    }
                }
            });
        });
    };

    Settings.prototype.addCheckboxChangeListener = function(){
        $('#' + this._id).find(".checkbox-row").off("click.changeAttributeState")
            .on("click.click.changeAttributeState", this.rebuildAttributesState.bind(this));
    };

    Settings.prototype.rebuildAttributesState = function(){
        var self = this;
        var numberOfCheckedAttributes = 0;
        setTimeout(function(){
            $('#' + self._id + ' .attribute-row').each(function(){
                var checked = $(this).hasClass("checked");
                if (checked){
                    numberOfCheckedAttributes++;
                }
                var id = $(this).attr('id').slice(9);
                self._categories[id].active = checked;

            });

            var confirmButton = $('#' + self._id + ' .settings-confirm');
            if (numberOfCheckedAttributes > 0){
                confirmButton.attr("disabled", false);
            } else {
                confirmButton.attr("disabled", true);
            }
        },100);
    };

    Settings.prototype.addConfirmListener = function(){
        var self = this;
        $('#' + this._id + ' .settings-confirm').off("click").on("click", function(){
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
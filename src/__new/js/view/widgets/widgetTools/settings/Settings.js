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
        this.addCheckboxChangeListener();
        this.addMultiCheckListener();
        this.addMultioptionsChangeListener();
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
     * Add the categories for filtering
     */
    Settings.prototype.addCategories = function(){
        this._settingsBody = $('#' + this._id + ' .tool-window-body');
        this._settingsBody.html("");
        this.addCheckbox("settings-all-attributes", "All attributes", "all-attributes-row", "", true);
        var asName = "";
        var asId = null;
        var self = this;
        this._attributes.forEach(function(attribute){
            if (attribute.about.attributeSetName != asName){
                asName = attribute.about.attributeSetName;
                asId = "settings-as-" + attribute.about.attributeSet;
                self.addCheckbox(asId, asName, "attribute-set-row", "", true);
            }
            var type = attribute.about.attributeType;
            var name = attribute.about.attributeName;
            var name4Settings = name;
            var id = "attr-" + attribute.about.attribute;
            var input = "";
            var active = JSON.parse(attribute.about.active);

            if (type == "boolean"){
                input = "checkbox";
                name4Settings = name4Settings + " <i>(Yes/No)</i>";
            }
            else if (type == "numeric") {
                input = "slider";
                name4Settings = name4Settings + " <i>(Range)</i> ";
            }
            else if (type == "text") {
                input = "select";
                name4Settings = name4Settings + " <i>(Category)</i>" +
                    "<div class='multioptions'>" +
                        "<span>Multioptions:</span>" +
                        "<label class='switch'>" +
                            "<input type='checkbox' class='multioptions-input'>" +
                            "<div class='slider-toggle'></div>" +
                        "</label>" +
                    "</div>";
            }
            self.addCheckbox('settings-' + id, name4Settings, "attribute-row", asId, active);
            self._categories[id] = {
                attrData: attribute,
                name: name,
                input: input,
                active: active,
                multioptions: false
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
     * It returns selected categories (filters)
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
        $('#' + this._id + ' .attribute-set-row').off("click.atributeSet").on("click.atributeSet", function(){
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
     * Add listener on multioptions change
     */
    Settings.prototype.addMultioptionsChangeListener = function(){
        $('#' + this._id).find(".multioptions-input").off("click.changeMultioptions")
            .on("click.changeMultioptions", this.rebuildAttributesState.bind(this));
        console.log($('#' + this._id).find(".multioptions-input"));
    };

	/**
     * Rebuild info about current state of attribute, if it's active or not.
     * Handle state of atribute sets checkboxes and All attributes checkbox.
     */
    Settings.prototype.rebuildAttributesState = function(){
        var self = this;
        var allAttributesCheckbox = $('#settings-all-attributes');
        var checkedAttributes = 0;
        var allAttributes = 0;
        console.log("rebulid");
        setTimeout(function(){
            var attributeRows = $('#' + self._id + ' .attribute-row');
            attributeRows.each(function(){
                var checked = $(this).hasClass("checked");
                var id = $(this).attr('id').slice(9);
                var multiToggle = $(this).find(".multioptions .switch > input:checked");
                var multioptions = false;

                // if checked, increment counter
                if (checked){
                    checkedAttributes++;
                }

                // multioptons active?
                if (multiToggle.length){
                    multioptions = true;
                }

                // set state of attribute
                self._categories[id].active = checked;
                self._categories[id].multioptions = multioptions;
                self._categories[id].attrData.about.active = checked;

                allAttributes++;
            });

            // review the state of all attributes checkbox and confirm button
            var confirmButton = $('#' + self._id + ' .settings-confirm');
            if (checkedAttributes > 0){
                confirmButton.attr("disabled", false);
                if (checkedAttributes == allAttributes){
                    if (!allAttributesCheckbox.hasClass("checked")){
                        allAttributesCheckbox.addClass("checked");
                    }
                }
            } else {
                confirmButton.attr("disabled", true);
                if (allAttributesCheckbox.hasClass("checked")){
                    allAttributesCheckbox.removeClass("checked");
                }
            }
        },100);
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
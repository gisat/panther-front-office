define(['../../error/ArgumentError',
        '../../error/NotFoundError',
        '../../util/Logger',

        './inputs/checkbox/Checkbox',
        '../View',
        './WidgetWarning',

        'string',
        'jquery',

        'text!./WidgetPlaceholder.html',
        'text!./WidgetFloater.html',
        'css!./Widget'
], function (ArgumentError,
             NotFoundError,
             Logger,

             Checkbox,
             View,
             WidgetWarning,

             S,
             $,

             WidgetPlaceholder,
             WidgetFloater) {
    "use strict";

    /**
     * Base class for creating floating widgets.
     * @param {Object} options
     * @param {string} options.elementId - Id of the widget
     * @param {Object} [options.dispatcher] - Optional parameter.
     * @param {string} [options.placeholderTargetId] - Optional parameter for old view. Id of the target, where should be placeholders rendered.
     * @param {string} [options.name] - Optional parameter. Name of the widget
     * @param {boolean} [options.isFloaterExtAlike] - Optional parameter. If true, floater will look like Ext window
     * @param {boolean} [options.isOpen] - Optional parameter. If true, floater is open by default
     * @param {boolean} [options.isWithoutFooter] - Optional parameter. If true, floater is rendered without footer
     * @constructor
     */
    var Widget = function (options) {
        View.apply(this, arguments);
        if (!options.elementId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "constructor", "missingElementId"));
        }

		this._floaterTarget = $("body");
        this._name = options.name || "";
		this._widgetId = options.elementId;
        this._isFloaterExtAlike = options.isFloaterExtAlike;
        this._isOpen = options.isOpen;
		this._isWithoutFooter = options.isWithoutFooter;

        if (options.dispatcher){
			this._dispatcher = options.dispatcher;
        }
        if (options.placeholderTargetId){
			this._placeholderTarget = $("#" + options.placeholderTargetId);
        }

        this.buildWidget();
    };

    Widget.prototype = Object.create(View.prototype);

	/**
     * Build widget - render floater (and placeholder for old view)
	 */
	Widget.prototype.buildWidget = function(){
        this.renderFloater();

        if (this._placeholderTarget){
            this.renderPlaceholderForOldToolbar();
        }
		if (this._isOpen){
            this.setState("floater-" + this._widgetId, true);
		}

		ExchangeParams.options.openWidgets["floater-" + this._widgetId] = this._widgetSelector.hasClass("open");
		this.handleLoading("show");
    };

	/**
     * Render floater for this widget
	 */
	Widget.prototype.renderFloater = function(){
		var floaterClass = "";
	    var minimiseIconSrc = "__new/img/minimise-icon.png";

	    if (this._isFloaterExtAlike){
	        floaterClass = "inverse";
			minimiseIconSrc = "__new/img/minimise-icon-dark.png";
        }

		var floater = S(WidgetFloater).template({
			name: this._name,
			widgetId: this._widgetId,
			minimiseSrc: minimiseIconSrc,
            floaterClass: floaterClass
		}).toString();

		this._floaterTarget.append(floater);
		this._widgetSelector = $("#floater-" + this._widgetId);
		this._widgetBodySelector = this._widgetSelector.find(".floater-body");
		this._widgetHeaderSelector = this._widgetSelector.find(".floater-header");
		this._warningSelector = this._widgetSelector.find(".floater-warning");
		this._widgetWarning = new WidgetWarning();

		if (this._isWithoutFooter){
			this.deleteFooter(this._widgetSelector);
		}
    };

	/**
     * Render placeholder for old view of top toolbar
	 */
	Widget.prototype.renderPlaceholderForOldToolbar = function(){
		var placeholdersContainer = this._placeholderTarget.find('.placeholders-container');
		var placeholder = S(WidgetPlaceholder).template({
			name: this._name,
			widgetId: this._widgetId
		}).toString();
		placeholdersContainer.append(placeholder);

		this._placeholderSelector = $("#placeholder-" + this._widgetId);
    };

    /**
     * Show/hide loading overlay
     * @param state {string}
     */
    Widget.prototype.handleLoading = function(state){
        var display;
        switch (state) {
            case "show":
                display = "block";
                break;
            case "hide":
                display = "none";
                break;
        }
        this._widgetSelector.find(".floater-overlay").css("display", display);
    };

	/**
     * Open/close floater
     * @param id {string} widget id
     * @param state {boolean} true to show floater
     */
    Widget.prototype.setState = function(id, state){
        var floater = $("#" + id);
        var placeholder = $("#" + id.replace("floater", "placeholder"));
        if (state){
            floater.addClass("open");
            placeholder.removeClass("open");
        } else {
            floater.removeClass("open");
            placeholder.addClass("open");
        }
    };

	/**
     * Delete floater footer
     */
    Widget.prototype.deleteFooter = function(floater){
        floater.find(".floater-footer").remove();
    };

    /**
     * It returns the checkbox
     * @param id {string} ID of the data theme
     * @param name {string} Name of the data theme
     * @returns {Checkbox}
     */
    Widget.prototype.buildCheckboxInput = function(id, name, target){
        return new Checkbox({
            id: id,
            name: name,
            target: target,
            containerId: "floater-" + this._widgetId
        });
    };

	/**
     * Create tool in header
     * @param name {string}
     */
    Widget.prototype.buildToolIconInHeader = function(name){
        var id = name.toLowerCase();
        this._widgetSelector.find(".floater-tools-container")
            .append('<div id="' + this._widgetId + '-' + id + '" title="'+ name +'" class="floater-tool widget-'+ id +'">' +
                '<img alt="' + name + '" src="__new/img/'+ id +'-dark.png"/>' +
                '</div>');
    };

	/**
	 * It shows in a widget body info about problems connected with this widget
     * @param action {string} CSS display value
     * @param warnings {Array} list of warnings codes
     */
    Widget.prototype.toggleWarning = function(action, warnings){
        this._warningSelector.css("display", action);
        if (warnings){
            var message = this._widgetWarning.generate(warnings);
            this._warningSelector.html(message);
        }
    };

    return Widget;
});
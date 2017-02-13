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
     * @constructor
     */

    var Widget = function (options) {
        View.apply(this, arguments);

        if (!options.elementId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "constructor", "missingElementId"));
        }
        if (!options.targetId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "constructor", "missingTargetElementId"));
        }

        this._name = options.name || "";
        this._widgetId = options.elementId;
        this._target = $("#" + options.targetId);
        if (this._target.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "constructor", "missingHTMLElement"));
        }

        this.buildWidget({
            widgetId: this._widgetId,
            name: this._name,
            target: this._target
        });

        this._widgetSelector = $("#floater-" + this._widgetId);
        this._placeholderSelector = $("#placeholder-" + this._widgetId);
        this._widgetBodySelector = this._widgetSelector.find(".floater-body");
        this._warningSelector = this._widgetSelector.find(".floater-warning");
        this._widgetWarning = new WidgetWarning();

        if (Config.toggles.hasOwnProperty("isUrbis") && Config.toggles.isUrbis){
            this._widgetSelector.addClass("open");
            this._widgetSelector.css("display","block"); // redundant, but necessary for animation
            this._placeholderSelector.removeClass("open");
        }

        ExchangeParams.options.openWidgets["floater-" + this._widgetId] = this._widgetSelector.hasClass("open");
        this.handleLoading("show");
    };

    Widget.prototype = Object.create(View.prototype);

    /**
     * Create the base structure of widget - placeholder and floater
     * @param options {Object}
     * @param options.widgetId {Object} JQuery object - widget Id
     * @param options.target {Object} JQuery object - target
     * @param options.name {Object} JQuery object - name of the widget
     */
    Widget.prototype.buildWidget = function(options){
        if (!options.widgetId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingWidgetId"));
        }
        if (!options.target){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingTarget"));
        }
        if (options.target.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingHTMLElement"));
        }
        if (!options.name){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingWidgetName"));
        }

        var placeholdersContainer = options.target.find('.placeholders-container');

        var placeholder = S(WidgetPlaceholder).template({
            name: options.name,
            widgetId: options.widgetId
        }).toString();

        var floater = S(WidgetFloater).template({
            name: options.name,
            widgetId: options.widgetId
        }).toString();

        placeholdersContainer.append(placeholder);
        options.target.append(floater);
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
     * @param state {string} show/hide
     */
    Widget.prototype.setState = function(id, state){
        var floater = $("#" + id);
        var placeholder = $("#" + id.replace("floater", "placeholder"));
        if (state){
            floater.addClass("open");
            floater.css("display","block"); // redundant, but necessary for animation
            placeholder.removeClass("open");
        } else {
            floater.removeClass("open");
            floater.css("display","none"); // redundant, but necessary for animation
            placeholder.addClass("open");
        }
    };

	/**
	 * Dock floater to the position in target
     * @param floater {JQuery} floater selector
     * @param target {JQuery} target container selector
     */
    Widget.prototype.dockFloater = function(floater, target){
        floater.appendTo(target)
            .addClass("docked")
            .css({
                left: 0,
                top: 0,
                height: '',
                width: ''
            })
            .draggable("disable");
    };

    /**
     * Undock floater to the position in target
     * @param floater {JQuery} floater selector
     * @param target {JQuery} target container selector
     */
    Widget.prototype.undockFloater = function(floater, target){
        floater.appendTo(target)
            .removeClass("docked")
            .css({
                left: 100,
                top: 100
            })
            .draggable("enable");
    };

	/**
     * Delete floater footer
     */
    Widget.prototype.deleteFooter = function(floater){
        floater.find(".floater-footer").remove();
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
                '<img alt="' + name + '" src="__new/img/'+ id +'.png"/>' +
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
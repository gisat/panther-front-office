define(['../../error/ArgumentError',
        '../../error/NotFoundError',
        '../../util/Logger',
        '../View',

        'string',
        'jquery',

        'text!./WidgetPlaceholder.html',
        'text!./WidgetFloater.html',
        'css!./Widget'
], function (ArgumentError,
             NotFoundError,
             Logger,
             View,

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
     * Delete floater footer
     */
    Widget.prototype.deleteFooter = function(floater){
        floater.find(".floater-footer").remove();
    };

    return Widget;
});
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

    var Widget = function () {
        View.apply(this, arguments);
    };

    Widget.prototype = Object.create(View.prototype);

    /**
     * Create the base structure of widget - placeholder and floater
     * @param options {Object}
     * @param options.widgetId {Object} JQuery object - widget Id
     * @param options.target {Object} JQuery object - target
     * @param options.name {Object} JQuery object - name of the widget
     */
    Widget.prototype.build = function(options){
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
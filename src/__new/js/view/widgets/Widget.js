define(['../../error/ArgumentError',
        '../../error/NotFoundError',
        '../../util/Logger',
        '../View',

        'string',
        'jquery',

        'text!./Widget.html',
        'css!./Widget'
], function (ArgumentError,
             NotFoundError,
             Logger,
             View,

             S,
             $,

             htmlContent) {
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
     * True if widget is minimised(docked)
     * @param widget
     * @returns {boolean}
     */
    Widget.prototype.isMinimised = function(widget){
        return !($(widget).hasClass("open"));
    };

    /**
     * Create the base structure of widget - placeholder and floater
     * @param widgetId {Object} JQuery object - widget Id
     * @param target {Object} JQuery object - target
     * @param name {Object} JQuery object - name of the widget
     */
    Widget.prototype.build = function(widgetId, target, name){
        if (!widgetId){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingWidgetId"));
        }
        if (!target){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingTarget"));
        }
        if (target.length == 0){
            throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingHTMLElement"));
        }
        if (!name){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Widget", "build", "missingWidgetName"));
        }

        var html = S(htmlContent).template({
            name: name,
            widgetId: widgetId
        }).toString();

        target.append(html);
    };

    return Widget;
});
define([
    '../../../actions/Actions',
    '../../../error/ArgumentError',
    '../../../error/NotFoundError',
    '../../../util/Logger',

    '../../../stores/Stores',
    '../Widget',

    'jquery',
    'string',
    'css!./OSMWidget.css'
], function(Actions,
            ArgumentError,
            NotFoundError,
            Logger,

            Stores,
            Widget,

            $,
            S
){
    /**
     * This widget handles loading the data from the Open Street Map. It focuses on the buildings. In order to load
     * relevant data it asks the user to provide the bounding box.
     * @param options {Object}
     * @param options.mapsContainer {MapsContainer}
     * @constructor
     */
    var OSMWidget = function(options){
        Widget.apply(this, arguments);

        this._mapsContainer = options.mapsContainer;

        this.addEventListeners();
    };

    OSMWidget.prototype = Object.create(Widget.prototype);

    /**
     * Rebuild widget. If period has been changed, redraw widget.
     */
    OSMWidget.prototype.rebuild = function(){
        console.log("Rebuild");
        this.handleLoading("hide");
        this.redraw();
    };

    /**
     * Redraw widget body with data relevant for current configuration
     */
    OSMWidget.prototype.redraw = function () {
        this._widgetBodySelector.html("");

        this._widgetBodySelector.append("" +
            "<p>" +
            "   <h1>OSM Data information</h1>" +
            "</p>");

        this.addEventListeners();
    };

    OSMWidget.prototype.addEventListeners = function () {

    };

    return OSMWidget;
});
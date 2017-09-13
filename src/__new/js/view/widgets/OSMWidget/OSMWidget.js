define([
    '../../../actions/Actions',
    '../../../error/ArgumentError',
    '../../../error/NotFoundError',
    '../../../util/Logger',

    '../../../stores/Stores',
    '../../../worldwind/layers/osm3D/OSMTBuildingLayer',
    '../Widget',

    'jquery',
    'string',
    'css!./OSMWidget.css'
], function(Actions,
            ArgumentError,
            NotFoundError,
            Logger,

            Stores,
            OSMTBuildingLayer,
            Widget,

            $,
            S
){
    var ClickRecognizer = WorldWind.ClickRecognizer;

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
        this._mapStore = options.mapStore;

        this.addEventListeners();

        // For testing rebuild here.
        this.rebuild();
    };

    OSMWidget.prototype = Object.create(Widget.prototype);

    /**
     * Rebuild widget. If period has been changed, redraw widget.
     */
    OSMWidget.prototype.rebuild = function(){
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
            "   <p>" +
            "       Select the area for which you want to load the 3D buildings. Area is selected by double clicking on " +
            "       the top left corner and bottom right corner." +
            "   </p>" +
            "   <input type='button' value='Select area of interest' id='osmAreaOfInterest'/>" +
            "</p>");

        this.addEventListeners();
    };

    OSMWidget.prototype.setSelection = function() {
        var self = this;
        var maps = this._mapStore.getAll();
        Object.keys(maps).forEach(function(key){
            var map = new MapWithBoundingBox(maps[key]);
            new ClickRecognizer(maps[key]._wwd, function (recognizer) {
                self.handleClick(recognizer, map);
            }.bind(this))
        });
    };

    OSMWidget.prototype.handleClick = function(recognizer, map){
        var wwd = map.wwd();
        var pointObjects = wwd.pick(wwd.canvasCoordinates(recognizer.clientX, recognizer.clientY));

        map.add(pointObjects.objects[0].position);
        if(map.isComplete()){
            this.show(map.boundingBox(), wwd);
            map.clear();
        }
    };

    OSMWidget.prototype.show = function(coordinates, wwd) {
        var source = {type: "boundingBox", coordinates: coordinates};
        var configuration = {
            interiorColor: new WorldWind.Color(1.0, 0.1, 0.1, 1.0),
            applyLighting: true,
            extrude: true,
            altitude: {type: "osm"},
            altitudeMode: WorldWind.RELATIVE_TO_GROUND,
            heatmap: {enabled: true, thresholds: [0, 10, 30, 50, 900]}
        };

        var buildings = new OSMTBuildingLayer(configuration, source);
        buildings.add(wwd);
        buildings.boundingBox = source.coordinates;
        buildings.zoom();
    };

    OSMWidget.prototype.addEventListeners = function () {
        $('#osmAreaOfInterest').off();

        $('#osmAreaOfInterest').on('click', this.setSelection.bind(this));
    };

    var MapWithBoundingBox = function(map) {
        this._map = map;

        this._points = [];
    };

    MapWithBoundingBox.prototype.wwd = function() {
        return this._map._wwd;
    };

    MapWithBoundingBox.prototype.add = function(position) {
        this._points.push(position);
    };

    MapWithBoundingBox.prototype.isComplete = function() {
        return this._points.length === 2;
    };

    MapWithBoundingBox.prototype.clear = function() {
        this._points = [];
    };

    MapWithBoundingBox.prototype.boundingBox = function() {
        return [
            Math.min(this._points[1].longitude, this._points[0].longitude),
            Math.min(this._points[1].latitude, this._points[0].latitude),
            Math.max(this._points[0].longitude, this._points[1].longitude),
            Math.max(this._points[0].latitude, this._points[1].latitude)];
    };

    return OSMWidget;
});
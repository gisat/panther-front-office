
import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import OSMTBuildingLayer from '../../../worldwind/layers/osm3D/OSMTBuildingLayer';
import Widget from '../Widget';

import './OSMWidget.css';

let ClickRecognizer = WorldWind.ClickRecognizer;
let polyglot = window.polyglot;

/**
 * This widget handles loading the data from the Open Street Map. It focuses on the buildings. In order to load
 * relevant data it asks the user to provide the bounding box.
 * @param options {Object}
 * @param options.mapsContainer {MapsContainer}
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @constructor
 */
let $ = window.$;
class OSMWidget extends Widget {
    constructor(options) {
        super(options);

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'OSMWidget', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'OSMWidget', 'constructor', 'Store map must be provided'));
        }

        this._mapsContainer = options.mapsContainer;
        this._mapStore = options.store.map;

        this.addEventListeners();

        // For testing rebuild here.
        this.rebuild();
    };

    /**
     * Rebuild widget. If period has been changed, redraw widget.
     */
    rebuild() {
        this.handleLoading("hide");
        this.redraw();
    };

    /**
     * Redraw widget body with data relevant for current configuration
     */
    redraw() {
        this._widgetBodySelector.html("");

        this._widgetBodySelector.append("" +
            "<p>" +
            "   " + polyglot.t("osmDataInformation") +
            "   <input type='button' value='Select area of interest' id='osmAreaOfInterest'/>" +
            "</p>");

        this.addEventListeners();
    };

    setSelection() {
        let self = this;
        let maps = this._mapStore.getAll();
        Object.keys(maps).forEach(function (key) {
            let map = new MapWithBoundingBox(maps[key]);
            new ClickRecognizer(maps[key]._wwd, function (recognizer) {
                self.handleClick(recognizer, map);
            })
        });
    };

    handleClick(recognizer, map) {
        let wwd = map.wwd();
        let pointObjects = wwd.pick(wwd.canvasCoordinates(recognizer.clientX, recognizer.clientY));

        map.add(pointObjects.objects[0].position);
        if (map.isComplete()) {
            this.show(map.boundingBox(), wwd);
            map.clear();
        }
    };

    show(coordinates, wwd) {
        let source = {type: "boundingBox", coordinates: coordinates};
        let configuration = {
            interiorColor: new WorldWind.Color(1.0, 0.1, 0.1, 1.0),
            applyLighting: true,
            extrude: true,
            altitude: {type: "osm"},
            altitudeMode: WorldWind.RELATIVE_TO_GROUND,
            heatmap: {enabled: true, thresholds: [0, 10, 30, 50, 900]}
        };

        let buildings = new OSMTBuildingLayer(configuration, source);
        buildings.add(wwd);
        buildings.boundingBox = source.coordinates;
        buildings.zoom();
    };

    addEventListeners() {
        $('#osmAreaOfInterest').off();

        $('#osmAreaOfInterest').on('click', this.setSelection.bind(this));
    };
}

class MapWithBoundingBox {
    constructor(map) {
        this._map = map;

        this._points = [];
    }


    wwd() {
        return this._map._wwd;
    };

    add(position) {
        this._points.push(position);
    };

    isComplete() {
        return this._points.length === 2;
    };

    clear() {
        this._points = [];
    };

    boundingBox() {
        return [
            Math.min(this._points[1].longitude, this._points[0].longitude),
            Math.min(this._points[1].latitude, this._points[0].latitude),
            Math.max(this._points[0].longitude, this._points[1].longitude),
            Math.max(this._points[0].latitude, this._points[1].latitude)];
    };
}

export default OSMWidget;
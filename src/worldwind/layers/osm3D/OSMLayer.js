
import osmtogeojson from 'osmtogeojson';
import WorldWind from '@nasaworldwind/worldwind';

let GeoJSONParser = WorldWind.GeoJSONParser;
let ArgumentError = WorldWind.ArgumentError;
let Logger = WorldWind.Logger;

/**
 * Constructs an OSMLayer.
 * @alias OSMLayer
 * @constructor
 * @classdesc Sets the properties and functions viable for any OSM data. It is intended to be an abstract class, only to be extended for specific OSM data.
 * @param {Object} configuration Configuration is used to set the attributes of {@link PlacemarkAttributes} or {@link ShapeAttributes}.
 * @param {Object} source Defines the data source of the layer. Its "type" can be either "boundingBox", "GeoJSONFile" or "GeoJSONData".
 * If the "type" is "boundingBox", "coordinates" must be defined. The order of the "coordinates" is "x1, y1, x2, y2".
 * If the "type" is "GeoJSONFile", "path" where the file resides must be defined.
 * If the "type" is "GeoJSONData", "data" itself must be defined.
 */
let $ = window.$;
class OSMLayer {
    constructor(configuration, source) {
        this._configuration = configuration;
        this.source = source;

        this._tag = null;
        this._type = [];
        this._worldWindow = null;
        this._data = {};
        this._dataSize = 0;
        this._boundingBox = null;
    };

    get configuration() {
        return this._configuration;
    }

    set configuration(configuration) {
        this._configuration = configuration;
    }

    get tag() {
        return this._tag;
    }

    set tag(tag) {
        this._tag = tag;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
    }

    get worldWindow() {
        return this._worldWindow;
    }

    set worldWindow(worldWindow) {
        this._worldWindow = worldWindow;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    get dataSize() {
        return this._dataSize;
    }

    set dataSize(dataSize) {
        this._dataSize = dataSize;
    }

    get boundingBox() {
        return this._boundingBox;
    }

    set boundingBox(boundingBox) {
        this._boundingBox = boundingBox;
    }

    /**
     * Sets the attributes of {@link PlacemarkAttributes} if the geometry is Point or MultiPoint; or of {@link ShapeAttributes} otherwise.
     * @param {GeoJSONGeometry} geometry An object containing the geometry of the OSM data in GeoJSON format for the layer.
     * @returns {Object} An object with its attributes set as {@link PlacemarkAttributes} or {@link ShapeAttributes},
     * where for both their attributes are defined in the configuration of the layer.
     */
    shapeConfigurationCallback(geometry) {
        let configuration = {};

        if (geometry.isPointType() || geometry.isMultiPointType()) {
            let placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
            for (let key in this._configuration)
                placemarkAttributes[key] = this._configuration[key];
            configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        }
        else {
            configuration.attributes = new WorldWind.ShapeAttributes(null);
            for (let key in this._configuration)
                configuration.attributes[key] = this._configuration[key];
        }

        return configuration;
    };

    /**
     * Calculates the rough size of a given object.
     * @param {Object} object The object to be calculated the size of.
     * @returns {Number} The number of bytes of the object given.
     */
    roughSizeOfObject = function (object) {
        let objectList = [];
        let stack = [object];
        let bytes = 0;

        while (stack.length) {
            let value = stack.pop();

            if (typeof value === 'boolean') {
                bytes += 4;
            }
            else if (typeof value === 'string') {
                bytes += value.length * 2;
            }
            else if (typeof value === 'number') {
                bytes += 8;
            }
            else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
                objectList.push(value);

                for (let i in value) {
                    stack.push(value[i]);
                }
            }
        }
        return bytes;
    };

    /**
     * Calculates the bounding box of a GeoJSON object, where its features are expected to be of type "Polygon" or "MultiPolygon".
     * @param {Object} dataGeoJSON GeoJSON object of which the bounding box is calculated.
     * @returns {Float[]} The bounding box for the given GeoJSON data.
     */
    calculateBoundingBox(dataGeoJSON) {
        let boundingBox = [Infinity, Infinity, -Infinity, -Infinity], polygons, latitude, longitude;

        for (let featureIndex = 0; featureIndex < dataGeoJSON.features.length; featureIndex++) {
            if (dataGeoJSON.features[featureIndex].geometry.type === "Polygon" || dataGeoJSON.features[featureIndex].geometry.type === "MultiPolygon") {
                polygons = dataGeoJSON.features[featureIndex].geometry.coordinates;

                for (let polygonsIndex = 0; polygonsIndex < polygons.length; polygonsIndex++) {
                    for (let coordinatesIndex = 0; coordinatesIndex < polygons[polygonsIndex].length; coordinatesIndex++) {
                        longitude = polygons[polygonsIndex][coordinatesIndex][0];
                        latitude = polygons[polygonsIndex][coordinatesIndex][1];
                        boundingBox[0] = boundingBox[0] < longitude ? boundingBox[0] : longitude; // minimum longitude (x1)
                        boundingBox[1] = boundingBox[1] < latitude ? boundingBox[1] : latitude; // minimum latitude (y1)
                        boundingBox[2] = boundingBox[2] > longitude ? boundingBox[2] : longitude; // maximum longitude (x2)
                        boundingBox[3] = boundingBox[3] > latitude ? boundingBox[3] : latitude; // maximum latitude (y2)
                    }
                }
            }
        }

        return boundingBox;
    };

    /**
     * Calls [loadByBoundingBox]{@link OSMLayer#loadByBoundingBox} if the "type" property of the "source" member letiable is "boundingBox" and the "coordinates" property of the "source" member letiable is defined.
     * Calls [loadByGeoJSONFile]{@link OSMLayer#loadByGeoJSONFile} if the "type" property of the "source" member letiable is "GeoJSONFile" and the "path" property of the "source" member letiable is defined.
     * Calls [loadByGeoJSONData]{@link OSMLayer#loadByGeoJSONData} if the "type" property of the "source" member letiable is "GeoJSONData" and the "data" property of the "source" member letiable is defined.
     * @throws {ArgumentError} If the source definition is wrong.
     */
    load() {
        if (this.source.type === "boundingBox" && this.source.coordinates)
            return this.loadByBoundingBox();
        else if (this.source.type === "GeoJSONFile" && this.source.path)
            return this.loadByGeoJSONFile();
        else if (this.source.type === "GeoJSONData" && this.source.data)
            return this.loadByGeoJSONData();
        else {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "OSMLayer", "load", "The source definition of the layer is wrong.")
            );
        }
    };

    /**
     * Makes an AJAX request to fetch the OSM building data using the "coordinates" property of the "source" member letiable and Overpass API,
     * converts them to GeoJSON using osmtogeojson API, sets "data" and "dataSize" member letiables using the GeoJSON data.
     * @throws {ArgumentError} If the "coordinates" property of the "source" member letiable doesn't have four values.
     * @throws {ArgumentError} If the request to OSM fails.
     */
    loadByBoundingBox() {
        if (this.source.coordinates.length !== 4) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "OSMLayer", "loadByBoundingBox", "The bounding box is invalid.")
            );
        }

        let _self = this;

        let data = '[out:json][timeout:25];(';
        for (let typeIndex = 0; typeIndex < this._type.length; typeIndex++) {
            // console.log(this._type[typeIndex]);
            data += this._type[typeIndex] + '[' + this._tag + '](' + this.source.coordinates[1] + ',' + this.source.coordinates[0] + ',' + this.source.coordinates[3] + ',' + this.source.coordinates[2] + '); ';
        }
        data += '); out body; >; out skel qt;';
        // console.log(data);

        return $.ajax({
            url: 'https://overpass-api.de/api/interpreter',
            data: data,
            type: 'POST',
            success: function (dataOverpass) {
                let dataOverpassGeoJSON = osmtogeojson(dataOverpass);
                _self._data = dataOverpassGeoJSON;
                if (_self._dataSize === 0)
                    _self._dataSize = _self.roughSizeOfObject(_self._data);
            },
            error: function (e) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OSMLayer", "loadByBoundingBox", "Request failed. Error: " + JSON.stringify(e))
                );
            }
        });
    };

    /**
     * Makes an AJAX request using the "path" property of the "source" member letiable to fetch the GeoJSON file,
     * sets "data" and "dataSize" member letiables using the GeoJSON data.
     * @throws {ArgumentError} If the data returned from the request is empty.
     * @throws {ArgumentError} If the request fails.
     */
    loadByGeoJSONFile() {
        let _self = this;

        return $.ajax({
            beforeSend: function (xhr) {
                if (xhr.overrideMimeType)
                    xhr.overrideMimeType("application/json");
            },
            dataType: "json",
            url: this.source.path,
            success: function (data) {
                if (data.length === 0) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "OSMLayer", "loadByGeoJSONFile", "File is empty.")
                    );
                }
                _self._data = data;
                if (_self._dataSize === 0)
                    _self._dataSize = _self.roughSizeOfObject(_self._data);
            },
            error: function (e) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OSMLayer", "loadByGeoJSONFile", "Request failed. Error: " + JSON.stringify(e))
                );
            }
        });
    };

    /**
     * Sets "data" and "dataSize" member letiables using the GeoJSON data assigned to the "data" property of the "source" member letiable.
     */
    loadByGeoJSONData() {
        this._data = this.source.data;
        if (this._dataSize === 0)
            this._dataSize = this.roughSizeOfObject(this._data);
    };

    /**
     * Sets the "worldWindow" member letiable and adds the layer to the WorldWindow.
     * @param {WorldWindow} worldWindow The WorldWindow where the layer is added to.
     */
    add(worldWindow) {
        this._worldWindow = worldWindow;
        let _self = this;
        $.when(_self.load()).then(function () {
            let OSMLayer = new WorldWind.RenderableLayer("OSMLayer");
            let OSMLayerGeoJSON = new GeoJSONParser(JSON.stringify(_self._data));
            OSMLayerGeoJSON.load(null, _self.shapeConfigurationCallback.bind(_self), OSMLayer);
            _self._worldWindow.addLayer(OSMLayer);
        });
    };

    /**
     * Zooms to the layer, by setting the center of the viewport to the center of the bounding box.
     * It uses an arbitrary value for the range of {@link LookAtNavigator}.
     * To be removed later.
     * @throws {ArgumentError} If boundingBox of the layer is null.
     */
    zoom() {
        if (this._boundingBox != null) {
            let boundingBox = this._boundingBox;
            let centerX = (boundingBox[0] + boundingBox[2]) / 2;
            let centerY = (boundingBox[1] + boundingBox[3]) / 2;
            this._worldWindow.navigator.lookAtLocation.longitude = centerX;
            this._worldWindow.navigator.lookAtLocation.latitude = centerY;
            // console.log(centerX + ", " + centerY);
            this._worldWindow.navigator.range = 4e3; // Should be automatically calculated.
            this._worldWindow.redraw();
        }
        else {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "OSMLayer", "zoom", "The bounding box of the layer is null.")
            );
        }
    };
}

export default OSMLayer;
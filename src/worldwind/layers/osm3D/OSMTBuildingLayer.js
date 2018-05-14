
import OSMBuildingLayer from './OSMBuildingLayer';
import GeoJSONParserTriangulationOSM from './GeoJSONParserTriangulationOSM';
import WorldWind from '@nasaworldwind/worldwind';

let MemoryCache = WorldWind.MemoryCache;
let BoundingBox = WorldWind.BoundingBox;
let Sector = WorldWind.Sector;
let DragRecognizer = WorldWind.DragRecognizer;
let PanRecognizer = WorldWind.PanRecognizer;
let ClickRecognizer = WorldWind.ClickRecognizer;
let TapRecognizer = WorldWind.TapRecognizer;
let PinchRecognizer = WorldWind.PinchRecognizer;
let RotationRecognizer = WorldWind.RotationRecognizer;
let TiltRecognizer = WorldWind.TiltRecognizer;
let GeoJSONFeature = WorldWind.GeoJSONFeature;

/**
 * Creates a sublass of the {@link OSMBuildingLayer} class.
 * @alias OSMTBuildingLayer
 * @constructor
 * @classdesc Creates sectors (tiles) using the bounding box of the layer with a fixed size for all the zoom levels. If there is at least a feature corresponding to a sector, creates an {@link OSMBuildingLayer}
 * containing the features, caches the layer, adds it if the sector corresponding to it is visible. Upon gestures, adds and/or removes the [layers]{@link OSMBuildingLayer} using the [cache]{@link MemoryCache}.
 * @param {Object} configuration Configuration is used to set the attributes of {@link ShapeAttributes}. Four more attributes can be defined, which are "extrude", "altitude", "altitudeMode" and "heatmap".
 * @param {Object} source Defines the data source of the layer.
 */
let $ = window.$;
class OSMTBuildingLayer extends OSMBuildingLayer {
    constructor(configuration, source) {
        super(configuration, source);

        /**
         * Holds the {@link RenderableLayer} and {@link GeoJSONParserTriangulationOSM} for each sector. The maximum size of the cache is 10MB.
         * @memberof OSMTBuildingLayer.prototype
         * @type {MemoryCache}
         */
        this._cache = new MemoryCache(10000000, 8000000);

        /**
         * An array holding both the sectors making up the layer's bounding box and their state of being added to the {@link WorldWindow} or not.
         * @memberof OSMTBuildingLayer.prototype
         * @type {Object[]}
         */
        this._sectors = [];
    };

    /**
     * The callback for [GestureRecognizers]{@link GestureRecognizer}, which are {@link DragRecognizer}, {@link PanRecognizer}, {@link ClickRecognizer}, {@link TapRecognizer}, {@link PinchRecognizer}, {@link RotationRecognizer} and {@link TiltRecognizer}.
     * For each sector of the layer, checks if it is visible. If it is and its layer is not added to the WorldWindow, adds it using the [cache]{@link MemoryCache}.
     * If it is not visible and it is added to the WorldWindow, removes it.
     */
    gestureRecognizerCallback(recognizer) {
        for (let sectorIndex = 0; sectorIndex < this._sectors.length; sectorIndex++) {
            let key = this._sectors[sectorIndex].sector.minLatitude + ',' + this._sectors[sectorIndex].sector.maxLatitude + ',' + this._sectors[sectorIndex].sector.minLongitude + ',' + this._sectors[sectorIndex].sector.maxLongitude;
            if (this.intersectsVisible(this._sectors[sectorIndex].sector) && !this._sectors[sectorIndex].added && this._cache.containsKey(key)) {
                // console.log("The layer in this sector has to be added.");
                this.worldWindow.addLayer(this._cache.entryForKey(key).renderableLayer);
                this._sectors[sectorIndex].added = true;
            }
            else if (!this.intersectsVisible(this._sectors[sectorIndex].sector) && this._sectors[sectorIndex].added && this._cache.containsKey(key)) {
                // console.log("The layer in this sector has to be removed.");
                this.worldWindow.removeLayer(this._cache.entryForKey(key).renderableLayer);
                this._sectors[sectorIndex].added = false;
            }
            /* else {
              console.log("No need to do something.");
            } */
            // console.log("the number of layers -> " + this.worldWindow.layers.length);
        }
    };

    /**
     * Checks if a given sector is visible.
     * @param {Sector} sector A {@link Sector} of the layer.
     * @returns {boolean} True if the sector intersects the frustum, otherwise false.
     */
    intersectsVisible(sector) {
        let boundingBox = new BoundingBox();
        boundingBox.setToSector(sector, this.worldWindow.drawContext.globe, 0, 15); // Maximum elevation 15 should be changed.

        return boundingBox.intersectsFrustum(this.worldWindow.drawContext.navigatorState.frustumInModelCoordinates);
    };

    /**
     * Sectorizes a bounding box. Each sector initially will be 0.02 to 0.02 degrees for all the zoom levels.
     */
    createSectors() {
        var boundingBox;
        if (this.boundingBox == null) {
            if (this.source.type === "boundingBox")
                boundingBox = this.source.coordinates;
            else
                boundingBox = this.calculateBoundingBox(this.data);
        }
        else {
            boundingBox = this.boundingBox;
        }

        let sectorSize = 0.02;
        let decimalCount = 5; // Can be derived from the coordinates.
        let sectorsOnXCount = Math.ceil((boundingBox[2] - boundingBox[0]).toFixed(decimalCount) / sectorSize);
        let sectorsOnYCount = Math.ceil((boundingBox[3] - boundingBox[1]).toFixed(decimalCount) / sectorSize);

        for (let indexY = 0; indexY < sectorsOnYCount; indexY++) {
            for (let indexX = 0; indexX < sectorsOnXCount; indexX++) {

                let x1 = (boundingBox[0] + sectorSize * indexX).toFixed(decimalCount);
                let x2, y2;
                if (indexX + 1 === sectorsOnXCount)
                    x2 = boundingBox[2].toFixed(decimalCount);
                else
                    x2 = (boundingBox[0] + sectorSize * (indexX + 1)).toFixed(decimalCount);

                let y1 = (boundingBox[1] + sectorSize * indexY).toFixed(decimalCount);

                if (indexY + 1 === sectorsOnYCount)
                    y2 = boundingBox[3].toFixed(decimalCount);
                else
                    y2 = (boundingBox[1] + sectorSize * (indexY + 1)).toFixed(decimalCount);

                this._sectors.push({sector: new Sector(y1, y2, x1, x2), added: false});
            }
        }
    };

    /**
     * Populates the [cache]{@link MemoryCache} with the features of the OSMTBuildingLayer.
     * The keys of the entries in the [cache]{@link MemoryCache} are made up of the coordinates of the bounding box of the sector they correspond to.
     * The entries are the {@link RenderableLayer} and {@link GeoJSONParserTriangulationOSM} for each sector.
     * If there is no feature corresponding to a sector, its corresponding [cache]{@link MemoryCache} entry is not created.
     */
    cache() {
        let polygons;

        this._cache.putEntry("entriesCount", {entriesCount: 0}, this.roughSizeOfObject(0));

            for (let featureIndex = 0; featureIndex < this.data.features.length; featureIndex++) {
                if (this.data.features[featureIndex].geometry.type === "Polygon" || this.data.features[featureIndex].geometry.type === "MultiPolygon") {

                    polygons = this.data.features[featureIndex].geometry.coordinates;

                    polygonsLoop:
                        for (let polygonsIndex = 0; polygonsIndex < polygons.length; polygonsIndex++) {
                                for (let coordinatesIndex = 0; coordinatesIndex < polygons[polygonsIndex].length; coordinatesIndex++) {
                                        for (let sectorIndex = 0; sectorIndex < this._sectors.length; sectorIndex++) {
                                            if (this._sectors[sectorIndex].sector.containsLocation(polygons[polygonsIndex][coordinatesIndex][1], polygons[polygonsIndex][coordinatesIndex][0])) {

                                                let feature = new GeoJSONFeature(this.data.features[featureIndex].geometry, this.data.features[featureIndex].properties, this.data.features[featureIndex].id, this.data.features[featureIndex].bbox);
                                                let key = this._sectors[sectorIndex].sector.minLatitude + ',' + this._sectors[sectorIndex].sector.maxLatitude + ',' + this._sectors[sectorIndex].sector.minLongitude + ',' + this._sectors[sectorIndex].sector.maxLongitude;

                                                if (!this._cache.containsKey(key)) {
                                                    let OSMBuildingLayer = new WorldWind.RenderableLayer("OSMBuildingLayer");
                                                    let OSMBuildingLayerGeoJSON = new GeoJSONParserTriangulationOSM(JSON.stringify({
                                                        "type": "FeatureCollection",
                                                        "features": []
                                                    }));
                                                    OSMBuildingLayerGeoJSON.load(null, this.shapeConfigurationCallback.bind(this), OSMBuildingLayer);
                                                    this._cache.putEntry(key, {
                                                        renderableLayer: OSMBuildingLayer,
                                                        parser: OSMBuildingLayerGeoJSON
                                                    }, this.roughSizeOfObject({
                                                        renderableLayer: OSMBuildingLayer,
                                                        parser: OSMBuildingLayerGeoJSON
                                                    }));
                                                    this._cache.entryForKey("entriesCount").entriesCount += 1;
                                                }

                                                let cached = this._cache.entryForKey(key);
                                                try {
                                                    cached.parser.addRenderablesForFeature(cached.renderableLayer, feature);
                                                    this._cache.entries[key].size += this.roughSizeOfObject(feature);
                                                    this._cache.usedCapacity += this.roughSizeOfObject(feature);
                                                    this._cache.freeCapacity -= this.roughSizeOfObject(feature);
                                                } catch (e) {
                                                    console.log(e);
                                                }

                                                break polygonsLoop;
                                            }
                                        }
                                }
                        }
                }
            }

        // console.log(this._cache);
    };

    /**
     * Sets the "worldWindow" member letiable and adds the layer using the [cache]{@link MemoryCache} to the WorldWindow.
     * The entries stored in the [cache]{@link MemoryCache} are added if they are visible.
     * Also registers the [GestureRecognizers]{@link GestureRecognizer}, which are {@link DragRecognizer}, {@link PanRecognizer}, {@link ClickRecognizer}, {@link TapRecognizer}, {@link PinchRecognizer}, {@link RotationRecognizer} and {@link TiltRecognizer}.
     * @param {WorldWindow} worldWindow The WorldWindow where the layer is added to.
     */
    add(worldWindow) {
        this.worldWindow = worldWindow;
        let _self = this;
        $.when(_self.load()).then(function () {
            _self.createSectors();
            _self.cache();
            for (let sectorIndex = 0; sectorIndex < _self._sectors.length; sectorIndex++) {
                let key = _self._sectors[sectorIndex].sector.minLatitude + ',' + _self._sectors[sectorIndex].sector.maxLatitude + ',' + _self._sectors[sectorIndex].sector.minLongitude + ',' + _self._sectors[sectorIndex].sector.maxLongitude
                if (_self.intersectsVisible(_self._sectors[sectorIndex].sector) && _self._cache.containsKey(key)) {
                    let cached = _self._cache.entryForKey(key);
                    _self.worldWindow.addLayer(cached.renderableLayer);
                    _self._sectors[sectorIndex].added = true;
                }
            }

            new DragRecognizer(_self.worldWindow.canvas, _self.gestureRecognizerCallback.bind(_self)); // desktop
            new PanRecognizer(_self.worldWindow.canvas, _self.gestureRecognizerCallback.bind(_self)); // mobile
            new ClickRecognizer(_self.worldWindow.canvas, _self.gestureRecognizerCallback.bind(_self)); // desktop
            new TapRecognizer(_self.worldWindow.canvas, _self.gestureRecognizerCallback.bind(_self)); // mobile
            new PinchRecognizer(_self.worldWindow.canvas, _self.gestureRecognizerCallback.bind(_self)); // mobile
            new RotationRecognizer(_self.worldWindow.canvas, _self.gestureRecognizerCallback.bind(_self)); // mobile
            new TiltRecognizer(_self.worldWindow.canvas, _self.gestureRecognizerCallback.bind(_self)); // mobile
        });
    };
}

export default OSMTBuildingLayer;
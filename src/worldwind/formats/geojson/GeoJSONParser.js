import WorldWind from '@nasaworldwind/worldwind';
import GeoJSONConstants from './GeoJSONConstants';
import GeoJSONFeature from './GeoJSONFeature';
import GeoJSONFeatureCollection from './GeoJSONFeatureCollection';
import GeoJSONCRS from './GeoJSONCRS';

const {
    ArgumentError, Logger, Location, SurfacePolygon, GeoJSONGeometryMultiPoint, GeoJSONGeometryLineString, GeoJSONGeometryMultiLineString,
    GeoJSONGeometryCollection, GeoJSONGeometryPoint, GeoJSONGeometryPolygon, GeoJSONGeometryMultiPolygon
    } = WorldWind;

class GeoJSONParser extends WorldWind.GeoJSONParser {
    constructor(url){
        super(url);
    }

    setGeoJSONCRS() {
        if (this.geoJSONObject[GeoJSONConstants.FIELD_CRS]){
            this._crs = new GeoJSONCRS (
                this.geoJSONObject[GeoJSONConstants.FIELD_CRS][GeoJSONConstants.FIELD_TYPE],
                this.geoJSONObject[GeoJSONConstants.FIELD_CRS][GeoJSONConstants.FIELD_PROPERTIES]);

            var crsCallback = (function() {
                this.addRenderablesForGeoJSON(this.layer);
            }).bind(this);

            this.crs.setCRSString(crsCallback);
        }
        else{
            // If no CRS, consider default one
            this.addRenderablesForGeoJSON(this.layer);
        }
    }

    addRenderablesForPolygon(layer, geometry, properties) {
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingLayer"));
        }

        if (!geometry) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingGeometry"));
        }

        var configuration = this.shapeConfigurationCallback(geometry, properties);

        if (!this.crs || this.crs.isCRSSupported()) {
            var pBoundaries = [];
            for (var boundariesIndex = 0, boundaries = geometry.coordinates;
                 boundariesIndex < boundaries.length; boundariesIndex++) {
                var positions = [];

                for (var positionIndex = 0, points = boundaries[boundariesIndex];
                     positionIndex < points.length; positionIndex++) {
                    var longitude = points[positionIndex][0],
                        latitude = points[positionIndex][1];
                    //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,
                    var reprojectedCoordinate = this.getReprojectedIfRequired(
                        latitude,
                        longitude,
                        this.crs);
                    var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                    positions.push(position);
                }
                pBoundaries.push(positions);
            }

            var shape;
            shape = new SurfacePolygon(
                pBoundaries,
                configuration && configuration.attributes ? configuration.attributes : null);
            if (configuration.highlightAttributes) {
                shape.highlightAttributes = configuration.highlightAttributes;
            }
            if (configuration && configuration.pickDelegate) {
                shape.pickDelegate = configuration.pickDelegate;
            }
            if (configuration && configuration.userProperties) {
                shape.userProperties = configuration.userProperties;
            }
            layer.addRenderable(shape);
        }
    }

    addRenderablesForFeatureCollection(layer, featureCollection) {
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeatureCollection",
                    "missingLayer"));
        }

        if (!featureCollection) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeatureCollection",
                    "missingFeatureCollection"));
        }

        if (featureCollection.features.length > 0) {
            for (var featureIndex = 0; featureIndex < featureCollection.features.length; featureIndex++) {
                var feature = new GeoJSONFeature(
                    featureCollection.features[featureIndex][GeoJSONConstants.FIELD_GEOMETRY],
                    featureCollection.features[featureIndex][GeoJSONConstants.FIELD_PROPERTIES],
                    featureCollection.features[featureIndex][GeoJSONConstants.FIELD_ID],
                    featureCollection.features[featureIndex][GeoJSONConstants.FIELD_BBOX]);
                this.addRenderablesForFeature(
                    layer,
                    feature);
            }
        }
    }

    addRenderablesForFeature(layer, feature) {
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeature", "missingLayer"));
        }

        if (!feature) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeature", "missingFeature"));
        }

        if (feature.geometry.type === GeoJSONConstants.TYPE_GEOMETRY_COLLECTION) {
            var geometryCollection = new GeoJSONGeometryCollection(
                feature.geometry.geometries,
                feature.bbox);
            this.addRenderablesForGeometryCollection(
                layer,
                geometryCollection,
                feature.properties);
        }
        else {
            this.addRenderablesForGeometry(
                layer,
                feature.geometry,
                feature.properties
            );
        }
    }

    addRenderablesForGeometry(layer, geometry, properties){
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometry", "missingLayer"));
        }

        if (!geometry) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometry", "missingGeometry"));
        }

        switch(geometry[GeoJSONConstants.FIELD_TYPE]){
            case GeoJSONConstants.TYPE_POINT:
                var pointGeometry = new GeoJSONGeometryPoint(
                    geometry[GeoJSONConstants.FIELD_COORDINATES],
                    geometry[GeoJSONConstants.FIELD_TYPE],
                    geometry[GeoJSONConstants.FIELD_BBOX]);
                this.addRenderablesForPoint(
                    layer,
                    pointGeometry,
                    properties ? properties : null);
                break;
            case GeoJSONConstants.TYPE_MULTI_POINT:
                var multiPointGeometry = new GeoJSONGeometryMultiPoint(
                    geometry[GeoJSONConstants.FIELD_COORDINATES],
                    geometry[GeoJSONConstants.FIELD_TYPE],
                    geometry[GeoJSONConstants.FIELD_BBOX]);
                this.addRenderablesForMultiPoint(
                    layer,
                    multiPointGeometry,
                    properties ? properties : null);
                break;
            case GeoJSONConstants.TYPE_LINE_STRING:
                var lineStringGeometry = new GeoJSONGeometryLineString(
                    geometry[GeoJSONConstants.FIELD_COORDINATES],
                    geometry[GeoJSONConstants.FIELD_TYPE],
                    geometry[GeoJSONConstants.FIELD_BBOX]);
                this.addRenderablesForLineString(
                    layer,
                    lineStringGeometry,
                    properties ? properties : null);
                break;
            case GeoJSONConstants.TYPE_MULTI_LINE_STRING:
                var multiLineStringGeometry = new GeoJSONGeometryMultiLineString(
                    geometry[GeoJSONConstants.FIELD_COORDINATES],
                    geometry[GeoJSONConstants.FIELD_TYPE],
                    geometry[GeoJSONConstants.FIELD_BBOX]);
                this.addRenderablesForMultiLineString(
                    layer,
                    multiLineStringGeometry,
                    properties ? properties : null);
                break;
            case GeoJSONConstants.TYPE_POLYGON:
                var polygonGeometry = new GeoJSONGeometryPolygon(
                    geometry[GeoJSONConstants.FIELD_COORDINATES],
                    geometry[GeoJSONConstants.FIELD_TYPE],
                    geometry[GeoJSONConstants.FIELD_BBOX]
                );
                this.addRenderablesForPolygon(
                    layer,
                    polygonGeometry,
                    properties ? properties : null);
                break;
            case GeoJSONConstants.TYPE_MULTI_POLYGON:
                var multiPolygonGeometry = new GeoJSONGeometryMultiPolygon(
                    geometry[GeoJSONConstants.FIELD_COORDINATES],
                    geometry[GeoJSONConstants.FIELD_TYPE],
                    geometry[GeoJSONConstants.FIELD_BBOX]);
                this.addRenderablesForMultiPolygon(
                    layer,
                    multiPolygonGeometry,
                    properties ? properties : null);
                break;
            default:
                break;
        }
    }

    addRenderablesForMultiPolygon(layer, geometry, properties) {
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                    "missingLayer"));
        }

        if (!geometry) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                    "missingGeometry"));
        }

        var configuration = this.shapeConfigurationCallback(geometry, properties);

        if (!this.crs || this.crs.isCRSSupported()) {
            for (var polygonsIndex = 0, polygons = geometry.coordinates;
                 polygonsIndex < polygons.length; polygonsIndex++) {
                var boundaries = [];
                for (var boundariesIndex = 0; boundariesIndex < polygons[polygonsIndex].length; boundariesIndex++) {
                    var positions = [];
                    for (var positionIndex = 0, points = polygons[polygonsIndex][boundariesIndex];
                         positionIndex < points.length; positionIndex++) {
                        var longitude = points[positionIndex][0],
                            latitude = points[positionIndex][1];
                        //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,;

                        var reprojectedCoordinate = this.getReprojectedIfRequired(
                            latitude,
                            longitude,
                            this.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }
                    boundaries.push(positions);
                }
                var shape;
                shape = new SurfacePolygon(
                    boundaries,
                    configuration && configuration.attributes ? configuration.attributes : null);
                if (configuration.highlightAttributes) {
                    shape.highlightAttributes = configuration.highlightAttributes;
                }
                if (configuration && configuration.pickDelegate) {
                    shape.pickDelegate = configuration.pickDelegate;
                }
                if (configuration && configuration.userProperties) {
                    shape.userProperties = configuration.userProperties;
                }
                layer.addRenderable(shape);
            }
        }
    }

    addRenderablesForGeoJSON(layer) {
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeoJSON", "missingLayer"));
        }

        switch(this.geoJSONType) {
            case GeoJSONConstants.TYPE_FEATURE:
                var feature = new  GeoJSONFeature(
                    this.geoJSONObject[GeoJSONConstants.FIELD_GEOMETRY],
                    this.geoJSONObject[GeoJSONConstants.FIELD_PROPERTIES],
                    this.geoJSONObject[GeoJSONConstants.FIELD_ID],
                    this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]
                );
                this.addRenderablesForFeature(
                    layer,
                    feature);
                break;
            case GeoJSONConstants.TYPE_FEATURE_COLLECTION:
                var featureCollection = new GeoJSONFeatureCollection(
                    this.geoJSONObject[GeoJSONConstants.FIELD_FEATURES],
                    this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]
                );
                this.addRenderablesForFeatureCollection(
                    layer,
                    featureCollection);
                break;
            case GeoJSONConstants.TYPE_GEOMETRY_COLLECTION:
                var geometryCollection = new GeoJSONGeometryCollection(
                    this.geoJSONObject[GeoJSONConstants.FIELD_GEOMETRIES],
                    this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]);
                this.addRenderablesForGeometryCollection(
                    layer,
                    geometryCollection,
                    null);
                break;
            default:
                this.addRenderablesForGeometry(
                    layer,
                    this.geoJSONObject,
                    null);
                break;
        }
    }
}

export default GeoJSONParser;
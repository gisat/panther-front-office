import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import BuildingShape from './shapes/BuildingShape'
import GeoJSONParserTriangulation from './GeoJSONParserTriangulation';

/**
 * Creates a subclass of the {@link GeoJSONParserTriangulation} class.
 * @alias GeoJSONParserTriangulationOSM
 * @constructor
 * @classdesc Triangulates polygons, which can be {@link Polygon}s or {@link MultiPolygon}s. Triangulated polygons improves rendering and painting performance compared to extruded polygons.
 * @param {String} dataSource The data source in GeoJSON format. Can be a string or a URL for the data.
 */
class GeoJSONParserTriangulationOSM extends GeoJSONParserTriangulation {

    /**
     * Invokes [lateralSurfaces]{@link GeoJSONParserTriangulationOSM#lateralSurfaces} and/or [topSurface]{@link GeoJSONParserTriangulationOSM#topSurface} to create a {@link TriangleMesh} for [Polygon]{@link GeoJSONGeometryPolygon} geometry.
     * <p>This method also invokes this GeoJSON's [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry. [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback} is extended by four attributes in the {@link OSMBuildingLayer}.
     * These attributes are "extrude", "altitude", "altitudeMode" and "heatmap".
     * The altitude of the Polygon is set using this function using [setAltitude]{@link BuildingShape#setAltitude}. If extrude and heatmap are enabled a new color is set for the Polygon.
     * If extrude is true, this function calls [lateralSurfaces]{@link GeoJSONParserTriangulationOSM#lateralSurfaces} and [topSurface]{@link GeoJSONParserTriangulationOSM#topSurface}. Otherwise it only calls [topSurface]{@link GeoJSONParserTriangulationOSM#topSurface}.</p>
     * Applications typically do not call this method directly. It is called by [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
     * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
     * @param {GeoJSONGeometryPolygon} geometry The Polygon geometry object.
     * @param {Object} properties The properties related to the Polygon geometry.
     * @throws {ArgumentError} If the specified layer is null or undefined.
     * @throws {ArgumentError} If the specified geometry is null or undefined.
     */
    addRenderablesForPolygon(layer, geometry, properties) {
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingLayer")
            );
        }

        if (!geometry) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingGeometry")
            );
        }

        let configuration = this.shapeConfigurationCallback(geometry, properties);
        let boundaries = geometry.coordinates;
        let OSMBuildingPolygon = new BuildingShape(properties);
        OSMBuildingPolygon.setAltitude(configuration);
        let altitude = OSMBuildingPolygon.altitude;
        if (configuration.extrude && configuration.heatmap.enabled)
            OSMBuildingPolygon.setColor(configuration);

        // console.log("configuration --> " + JSON.stringify(configuration));
        // console.log("geometry --> " + JSON.stringify(geometry));
        // console.log("boundaries --> " + boundaries);
        // console.log("boundaries.length --> " + boundaries.length);
        // console.log("properties --> " + JSON.stringify(properties));
        // console.log("properties.tags.height --> " + properties.tags.height);
        // console.log("altitude --> " + altitude);

        if (!this.crs || this.crs.isCRSSupported()) {
            if (configuration.extrude === true)
                this.lateralSurfaces(configuration, altitude, boundaries);
            this.topSurface(configuration, altitude, boundaries);
        }
    };

    /**
     * Invokes [lateralSurfaces]{@link GeoJSONParserTriangulationOSM#lateralSurfaces} and/or [topSurface]{@link GeoJSONParserTriangulationOSM#topSurface} to create a {@link TriangleMesh} for [MultiPolygon]{@link GeoJSONGeometryMultiPolygon} geometry.
     * <p>This method also invokes this GeoJSON's [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback} for the geometry. [shapeConfigurationCallback]{@link Shapefile#shapeConfigurationCallback} is extended by three attributes in the {@link OSMBuildingLayer}.
     * These attributes are "extrude", altitude", "altitudeMode" and "heatmap".
     * The altitude of the MultiPolygon is set using this function using [setAltitude]{@link BuildingShape#setAltitude}. If extrude and heatmap are enabled a new color is set for the MultiPolygon.
     * If extrude is true, this function calls [lateralSurfaces]{@link GeoJSONParserTriangulationOSM#lateralSurfaces} and [topSurface]{@link GeoJSONParserTriangulationOSM#topSurface}. Otherwise it only calls [topSurface]{@link GeoJSONParserTriangulationOSM#topSurface}.</p>
     * Applications typically do not call this method directly. It is called by [addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}.
     * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
     * @param {GeoJSONGeometryMultiPolygon} geometry The MultiPolygon geometry object.
     * @param {Object} properties The properties related to the MultiPolygon geometry.
     * @throws {ArgumentError} If the specified layer is null or undefined.
     * @throws {ArgumentError} If the specified geometry is null or undefined.
     */
    addRenderablesForMultiPolygon(layer, geometry, properties) {
        if (!layer) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon", "missingLayer")
            );
        }

        if (!geometry) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon", "missingGeometry")
            );
        }

        let configuration = this.shapeConfigurationCallback(geometry, properties);
        let polygons = geometry.coordinates, boundaries = [];
        let OSMBuildingMultiPolygon = new BuildingShape(properties);
        OSMBuildingMultiPolygon.setAltitude(configuration);
        let altitude = OSMBuildingMultiPolygon.altitude;
        if (configuration.extrude && configuration.heatmap.enabled)
            OSMBuildingMultiPolygon.setColor(configuration);

        // console.log("properties --> " + JSON.stringify(properties));
        // console.log("properties.tags.height (MultiPolygon) --> " + properties.tags.height);
        // console.log("altitude --> " + altitude);

        if (!this.crs || this.crs.isCRSSupported()) {
            for (let polygonsIndex = 0; polygonsIndex < polygons.length; polygonsIndex++) {
                boundaries = polygons[polygonsIndex];
                if (configuration.extrude === true)
                    this.lateralSurfaces(configuration, altitude, boundaries);
                this.topSurface(configuration, altitude, boundaries);
            }
        }
    };
}

export default GeoJSONParserTriangulationOSM;
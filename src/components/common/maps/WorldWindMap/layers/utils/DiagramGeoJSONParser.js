import WorldWind from 'webworldwind-esa';
import * as turf from '@turf/turf'

const {GeoJSONParser, GeoJSONConstants, GeoJSONGeometryCollection, GeoJSONFeature, ArgumentError, Logger} = WorldWind;

/**
 * Class extending WorldWind.GeoJSONParser. Parser expect GeoJSON polygon layer as input. 
 * Parser returns polygon centroids as SurfaceCircle Renderables. Radius is defined in each feture by key defined by layer metadata.attributeDataKey.
 * 
 * 
 * @param GeoJSONData {Object} GeoJSON polygon data to be parsed
 * @param metadata {Object} Layer metadata
 * @param series {string} How should be diagram radius calculated.
 * 	- [volume] Value is volume of circle
 * @param normalized {boolean} Normalize diagram radius by max radius. Default is true.
 * @param normalizedMaxRadius {number} Max radius. Default is 200km.
 * @param statistics {Object} Statistics for diagram value needs to be filled for normalization.
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class DiagramGeoJSONParser extends GeoJSONParser {
	
	constructor(GeoJSONData, metadata, series = 'volume', normalized = true, normalizedMaxRadius = 100000, statistics = {}) {
		super(GeoJSONData);

		this.layerMetadata = metadata;
		this.fallbackRadius = normalizedMaxRadius;
		this.series = series;
		this.normalized = normalized;
		this.normalizedMaxRadius = normalizedMaxRadius;
		this.statistics = statistics;
		this.normalizationCoefficient = 1;

		const maxValRadius = this.getRadius(this.statistics.max);
		if(this.normalized && (maxValRadius > this.normalizedMaxRadius)) {
			this.normalizationCoefficient = maxValRadius / this.normalizedMaxRadius
		}
	};

	getCircleRadiusByVolume(value) {
		return Math.sqrt(value / Math.PI, 2) ;
	}

	getRadius(value) {
		let radius;
		switch (this.series) {
			case 'value':
				radius = value;
				break;
			case 'volume':
				radius = this.getCircleRadiusByVolume(value) * 100//m
				break;
			default:
				radius = this.getCircleRadiusByVolume(value) * 100//m
				break;
		}
		return radius;

	}

	addRenderablesDiagram(layer, geometry, properties) {
		const configuration = this.shapeConfigurationCallback(geometry, properties);

		const location = new WorldWind.Location(geometry[1], geometry[0]);

		let value;
		if(this.layerMetadata && this.layerMetadata.attributeDataKey) {
			value = properties[this.layerMetadata.attributeDataKey];
		} else {
			value = this.fallbackRadius;
		}

		const radius = this.getRadius(value) / this.normalizationCoefficient;

		const attributes = new WorldWind.ShapeAttributes(null);

		const shape = new WorldWind.SurfaceCircle(location, radius, attributes);

		if (configuration && configuration.userProperties) {
			shape.userProperties = configuration.userProperties;
		}
			
		layer.addRenderable(shape);
	}

	/**
	 * Overriden
	 * Iterates over this GeoJSON's geometries and creates shapes for them. See the following methods for the
	 * details of the shapes created and their use of the
	 * [shapeConfigurationCallback]{@link GeoJSONParser#shapeConfigurationCallback}:
	 * <ul>
	 *     <li>[addRenderablesForGeometry]{@link GeoJSONParser#addRenderablesForGeometry}</li>
	 *     <li>[addRenderablesForGeometryCollection]{@link GeoJSONParser#addRenderablesForGeometryCollection}</li>
	 *     <li>[addRenderablesForFeature]{@link GeoJSONParser#addRenderablesForFeature}</li>
	 *     <li>[addRenderablesForFeatureCollection]{@link GeoJSONParser#addRenderablesForFeatureCollection}</li>
	 * </ul>
	 * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
	 * @throws {ArgumentError} If the specified layer is null or undefined.
	 */
	addRenderablesForGeoJSON = function (layer) {
		if (!layer) {
			throw new ArgumentError(
				Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeoJSON", "missingLayer"));
		}

		if(this.geoJSONObject && this.geoJSONObject.features && this.geoJSONObject.features.length > 0) {
			const count = this.geoJSONObject.features.length;
			for(let i = 0; i < count; i++) {
				const feature = this.geoJSONObject.features[i];
				const polygon = turf.multiPolygon(feature.geometry.coordinates);
				const centroid = turf.centroid(polygon);

				this.addRenderablesDiagram(
					layer,
					centroid.geometry.coordinates,
					feature.properties
					);
			}
		}		
	};
}

export default DiagramGeoJSONParser;


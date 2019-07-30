import WorldWind from 'webworldwind-esa';
import * as turf from '@turf/turf'
import {getRadius} from './diagram'
import {rangeMap} from '../../../../../../utils/statistics';
import {MIN_DIAGRAM_RADIUS, MAX_DIAGRAM_RADIUS} from '../../styles/cartodiagram';

const {GeoJSONParser, ArgumentError, Logger, SurfaceCircle, ShapeAttributes} = WorldWind;

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
	
	constructor(GeoJSONData, metadata, series = 'volume', normalized = true, normalizedMaxRadius = MAX_DIAGRAM_RADIUS, normalizedMinRadius = MIN_DIAGRAM_RADIUS, statistics = {}) {
		super(GeoJSONData);

		this.layerMetadata = metadata;
		this.fallbackRadius = normalizedMaxRadius;
		this.series = series;
		this.normalized = normalized;
		this.normalizedMaxRadius = normalizedMaxRadius;
		this.normalizedMinRadius = normalizedMinRadius;
		this.statistics = statistics;
		this.normalizationCallback = this.normalized ? rangeMap([getRadius(statistics.min, this.series), getRadius(statistics.max, this.series)], [normalizedMinRadius, normalizedMaxRadius]) : null;
	};

	addRenderablesDiagram(layer, geometry, properties) {
		const configuration = this.shapeConfigurationCallback(geometry, properties);

		const location = new WorldWind.Location(geometry[1], geometry[0]);

		let value;
		if(this.layerMetadata && this.layerMetadata.attributeDataKey) {
			value = properties[this.layerMetadata.attributeDataKey];
		} else {
			value = this.fallbackRadius;
		}

		let radius = getRadius(value, this.series, this.normalizationCallback);

		const attributes = new WorldWind.ShapeAttributes(null);

		if(isNaN(radius)) {
			//TODO - test on no data
			radius = 0
		}

		const shape = new WorldWind.SurfaceCircle(location, radius, attributes);

		if (configuration && configuration.userProperties) {
			shape.userProperties = configuration.userProperties;
		}
		//TODO - better scale for negative values 
		//dont add shape to renderable for radius 0, it cause render error
		if(!radius){
			shape.enabled = false;
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
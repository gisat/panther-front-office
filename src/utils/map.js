import config from '../config';
import _ from 'lodash';
import {geoBounds, geoCentroid, geoDistance} from 'd3-geo';

const RANGE_COEFF = 140000;
const DEFAULT_RANGE = 10000000;

/**
 * @param geometry {Object} GeoJSON geometry
 * @returns {GeoJSON}
 */
function getGeoJsonFromGeometry (geometry){
	return {
		"type": "Feature",
		"geometry": geometry
	}
}

/**
 * It converts list of points [lon,lat] to GeoJSON structure
 * @param points {Array} List of points
 * @returns {GeoJSON}
 */
function getGeoJsonFromPoints (points){
	let json = {
		"type": "FeatureCollection",
		"features": []
	};
	points.forEach(function(point){
		json["features"].push({
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": point
			}
		})
	});
	return json;
}

/**
 * Return GeoJSON geometry from bounding box
 * @param bboxString {string} Bounding box as string "maxLon, minLat, minLon, maxLat"
 * @returns {{type: string, coordinates: Array}} GeoJSON geometry
 */
function getGeometryFromBbox (bboxString){

	let bbox = bboxString.split(",");

	let points = [];
	let minLon = Number(bbox[2]);
	let minLat = Number(bbox[1]);
	let maxLon = Number(bbox[0]);
	let maxLat = Number(bbox[3]);

	points.push([minLon,minLat]);
	points.push([maxLon,maxLat]);
	points.push([minLon,maxLat]);
	points.push([maxLon,minLat]);

	/**
	 * Add centroid for more precise calculation of bbox
	 */
	points.push(geoCentroid(getGeoJsonFromPoints(points)));

	return {
		"type": "MultiPoint",
		"coordinates": points
	}
}

/**
 * It calculates lookAtLocation and range parametrs for zooming based on given geometry and viewport ratio
 * @param geometry {Object} GeoJSON geometry
 * @param viewport {WorldWind.Rectangle}
 * @returns {{lookAtLocation: {latitude: number, longitude: number}, range: number}}
 */
function getNavigatorParams(geometry, viewport) {
	let geojson = getGeoJsonFromGeometry(geometry);

	/**
	 * get bounding box (IMPORTANT - the inside of a polygon is all points that the polygon winds around in a clockwise order)
	 */
	let bounds = geoBounds(geojson);

	/**
	 * add other two corners to bbox (due to more precise calculation of centroid)
	 */
	bounds.push([bounds[0][0],bounds[1][1]]);
	bounds.push([bounds[1][0],bounds[0][1]]);

	/**
	 * calculate centroid
	 */
	let centroid = geoCentroid(getGeoJsonFromPoints(bounds));
	let range = getRangeFromBbox(bounds, viewport);

	return {
		lookAtLocation: {
			latitude: centroid[1],
			longitude: centroid[0]
		},
		range: range
	}
}

/**
 * Calculate range according to bbox size and viewport ratio
 * @param bbox {Array}
 * @param viewport {WorldWind.Rectangle}
 * @returns {number} range
 */
function getRangeFromBbox(bbox, viewport){
	let viewportRatio = 16/9;

	let width = viewport.width;
	let height = viewport.height;
	let range = DEFAULT_RANGE;

	let diagonalDistance_1 = geoDistance(bbox[0], bbox[1]);
	let diagonalDistance_2 = geoDistance(bbox[3], bbox[2]);

	let meridianDistance = geoDistance(bbox[0], bbox[2]);
	let parallelDistance_1 = geoDistance(bbox[0], bbox[3]);
	let parallelDistance_2 = geoDistance(bbox[1], bbox[2]);
	let parallelDistance = parallelDistance_1;
	if (parallelDistance_2 > parallelDistance_1){
		parallelDistance = parallelDistance_2;
	}

	if (Math.abs(diagonalDistance_1 - diagonalDistance_2) > 0.000001){
		console.error("### utils/map getRangeFromBbox : A control distance calculation is higher than a limit.");
		return range;
	}

	// calculate window size ratio
	if (width > 1 && height > 1){
		viewportRatio = width/height;
		if (viewportRatio < 1){
			viewportRatio = 1/viewportRatio;
		}
	}
	// calculate area size ratio
	let areaSizeRatio = parallelDistance/meridianDistance;

	// distance between bounding box corners in degrees
	let distanceInDegrees = diagonalDistance_1 * (180/Math.PI);
	if (distanceInDegrees < 0.01){
		distanceInDegrees = 0.01;
	}

	// Calculate range
	range = distanceInDegrees*RANGE_COEFF*viewportRatio;

	// Adjust range for specific options
	if (areaSizeRatio > 2 && viewportRatio > 1.5 && distanceInDegrees < 20){
		range /= viewportRatio;
	}

	// TODO Solve this for locations with high altitude (e.g. mountains)
	if (range < 1000) {
		return 1000;
	}

	return range;
}

export default {
	/**
	 * @param bbox {string} minLon, maxLat, maxLon, minLat
	 * @param viewport {WorldWind.Rectangle}
	 */
	getNavigatorParamsFromBbox: function(bbox, viewport){
		let geometry = getGeometryFromBbox(bbox);
		return getNavigatorParams(geometry, viewport);
	},

	/**
	 * @param geometry {Object} GeoJSON geometry
	 * @param viewport {WorldWind.Rectangle}
	 */
	getNavigatorParamsFromGeometry: function(geometry, viewport){
		return getNavigatorParams(geometry, viewport);
	}
}



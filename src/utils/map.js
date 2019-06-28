import config from '../config';
import _ from 'lodash';
import {geoBounds, geoCentroid, geoDistance} from 'd3-geo';
import WorldWind from 'webworldwind-esa';
import fetch from "isomorphic-fetch";

const RANGE_COEFF = 140000;
const DEFAULT_RANGE = 10000000;
const DEFAULT_ALTITUDE = 500;

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
 *
 * @param geometry {Object} GeoJSON geometry
 * @returns {Array}
 */
function getGeometryBbox(geometry){
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

	return bounds;
}

/**
 * Get polygon geometry from two WorldWind Positions
 * @param positions {Array} Collection of two WorldWind.Position
 * @returns {Object} GeoJSON geometry
 */
function getPolygonGeometryFromWorldWindPositions(positions){
	let topLeft = [positions[0].longitude, positions[0].latitude];
	let bottomRight = [positions[1].longitude, positions[1].latitude];
	let topRight = [positions[1].longitude, positions[0].latitude];
	let bottomLeft = [positions[0].longitude, positions[1].latitude];

	return {
		"type": "Polygon",
		"coordinates": [[topLeft, topRight, bottomRight, bottomLeft, topLeft]]
	}
}

/**
 * It calculates lookAtLocation and range parametrs for zooming based on given geometry and viewport ratio
 * @param geometry {Object} GeoJSON geometry
 * @param wwd {WorldWind.Window}
 * @returns {{lookAtLocation: {latitude: number, longitude: number}, range: number}}
 */
function getNavigatorParams(geometry, wwd) {
	let bounds = getGeometryBbox(geometry);

	/**
	 * calculate centroid
	 */
	let centroid = geoCentroid(getGeoJsonFromPoints(bounds));
	let lookAtLocation = {
		latitude: centroid[1],
		longitude: centroid[0]
	};
	let range = getRangeFromBbox(bounds, lookAtLocation, wwd);

	return {
		lookAtLocation: lookAtLocation,
		range: range
	}
}

/**
 * Calculate range according to bbox size and viewport ratio
 * @param bbox {Array}
 * @param wwd {WorldWind.Window}
 * @param centroid {WorldWind.lookAtLocation}
 * @returns {number} range
 */
function getRangeFromBbox(bbox, centroid, wwd){
	let viewportRatio = 16/9;

	let width = wwd.viewport.width;
	let height = wwd.viewport.height;
	let range = DEFAULT_RANGE;
	let altitude = DEFAULT_ALTITUDE;

	let elevationModel = wwd.globe.elevationModel;
	if (elevationModel && centroid){
		let elevation = elevationModel.elevationAtLocation(centroid.latitude, centroid.longitude);
		if (elevation){
			altitude = elevation;
		}
	}

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
	if (distanceInDegrees < 0.0001){
		distanceInDegrees = 0.0001;
	}

	// Calculate range
	range = distanceInDegrees*RANGE_COEFF*viewportRatio;

	// Adjust range for specific options
	if (areaSizeRatio > 2 && viewportRatio > 1.5 && distanceInDegrees < 20 && distanceInDegrees > 0.01){
		range /= viewportRatio;
	}

	return (range + altitude);
}

/**
 * @param placeString {string}
 * @return {Promise}
 */
function getLocationFromPlaceString(placeString) {
	let boxRange = 100000;
	let lat, lon = null;

	if (placeString.length) {
		let firstChar = Number(placeString[0]);
		if (isNaN(firstChar)) {
			let url = "http://open.mapquestapi.com/nominatim/v1/search.php?key=2qc94oOJwV6p7KaClJVSoLyevmPsLqlS&format=json&q="+placeString+"&limit=1";

			return fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(
				response => {
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(body => {
							if (body.length) {
								let data = body[0];
								lat = Number(data.lat);
								lon = Number(data.lon);
								// TODO range from bbox
								if ((lat || lat === 0) && (lon || lon === 0)) {
									return {boxRange, center: {lat, lon}};
								}

							} else {
								console.warn("utils/map#getLocationFromPlaceString: No location found for input: ", placeString);
							}
						});
					} else {
						console.warn("utils/map#getLocationFromPlaceString: No location found for input: ", placeString);
					}
				},
				error => {
					throw error;
				}
			);
		} else {
			let coordinates = placeString.split(/[,; ]/);
			if (coordinates.length) {
				lat = Number(coordinates[0]);
				lon = coordinates[1] ? Number(coordinates[1]) : 0;
			}

			if ((lat || lat === 0) && (lon || lon === 0)) {
				return Promise.resolve({boxRange, center: {lat, lon}});
			} else {
				console.warn("utils/map#getLocationFromPlaceString: No location found for input: ", placeString);
			}
		}
	} else {
		console.warn("utils/map#getLocationFromPlaceString: Empty input string!");
	}
}


export default {
	getLocationFromPlaceString,
	/**
	 * @param bbox {string} minLon, maxLat, maxLon, minLat
	 * @param wwd {WorldWind.Window}
	 */
	getNavigatorParamsFromBbox: function(bbox, wwd){
		let geometry = getGeometryFromBbox(bbox);
		return getNavigatorParams(geometry, wwd);
	},

	/**
	 * @param geometry {Object} GeoJSON geometry
	 * @param wwd {WorldWind.Window}
	 */
	getNavigatorParamsFromGeometry: function(geometry, wwd){
		return getNavigatorParams(geometry, wwd);
	},

	getGeometryBbox: getGeometryBbox,
	getPolygonGeometryFromWorldWindPositions: getPolygonGeometryFromWorldWindPositions
}



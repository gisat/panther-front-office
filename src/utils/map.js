import _ from 'lodash';
import fetch from "isomorphic-fetch";
import * as turf from '@turf/turf';
import createCachedSelector from "re-reselect";

const ensureViewIntegrity = (view) => {
	if (view) {
		if (view.heading && view.heading > 360) {
			view.heading = view.heading % 360;
		}

		if (view.heading && view.heading < 0) {
			view.heading = 360 - (-view.heading % 360);
		}

		if (view.tilt && view.tilt < 0) {
			view.tilt = 0;
		}

		if (view.tilt && view.tilt > 90) {
			view.tilt = 90;
		}

		if (view.range && view.range < 0.01) {
			view.range = 0.01;
		}

		if (view.center) {
			if (view.center.lat) {
				if (view.center.lat > 90) {
					view.center.lat = 90;
				} else if (view.center.lat < -90) {
					view.center.lat = -90;
				}
			}

			if (view.center.lon) {
				if (view.center.lon > 360 || view.center.lon < -360) {
					view.center.lon %= 360;
				}

				if (view.center.lon > 180) {
					view.center.lon = -180 + (view.center.lon - 180);
				} else if (view.center.lon < -180) {
					view.center.lon = 180 + (view.center.lon + 180);
				} else if (view.center.lon === -180) {
					view.center.lon = 180;
				}
			}
		}
	}

	return view;
};

/**
 * @param placeString {string} Text (e.g. Praha, France, ...) or coordinates (e.g. 10,50 or 10;50 or 10 50 as latitude,longitude) as input
 * @return {Promise} {{center: {lon: number, lat: number}, boxRange: number}}
 */
function getLocationFromPlaceString(placeString) {
	let boxRange = 100000;
	let lat, lon = null;

	if (placeString.length) {
		let firstChar = Number(placeString[0]);
		if (isNaN(firstChar)) {
			let url = "https://open.mapquestapi.com/nominatim/v1/search.php?key=2qc94oOJwV6p7KaClJVSoLyevmPsLqlS&format=json&q="+placeString+"&limit=1";

			return fetch(url, {
				method: 'GET',
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
								if (data.boundingbox) {
									const bbox = data.boundingbox;
									boxRange = getBoxRangeFromBoundingBox({
										minLat: bbox[0],
										maxLat: bbox[1],
										minLon: bbox[2],
										maxLon: bbox[3]
									});
								}
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

/**
 *
 * @param bbox {{minLat: number, minLon: number, maxLat: number, maxLon: number}}
 * @param latitude {boolean}
 * @return {number}
 */
function getBoxRangeFromBoundingBox(bbox, latitude) {
	const MIN_BOX_RANGE = 1000;
	const RANGE_COEFF = 125000; //approximately one degree of longitude on equator in meters

	// TODO naive for now
	let latDiff = Math.abs(bbox.maxLat - bbox.minLat);
	let lonDiff = Math.abs(bbox.maxLon - bbox.minLon);

	let diff = Math.max(latDiff, lonDiff);
	let boxRange = RANGE_COEFF*diff;
	if (latitude) {
		boxRange /= Math.cos(latitude * Math.PI/180)
	}

	return boxRange > MIN_BOX_RANGE ? boxRange : MIN_BOX_RANGE;
}

/**
 * @param geometry {Object} geojson geometry
 * @param reflectLatitude {boolean}
 * @return {Object} view
 */
function getViewFromGeometry(geometry, reflectLatitude) {
	let bbox = turf.bbox(geometry);
	let center = turf.center(geometry);
	let boxRange = getBoxRangeFromBoundingBox({
		minLat: bbox[1],
		minLon: bbox[0],
		maxLat: bbox[3],
		maxLon: bbox[2]
	}, reflectLatitude ? center.geometry.coordinates[1] : null);

	return {
		center: {
			lat: center.geometry.coordinates[1],
			lon: center.geometry.coordinates[0]
		},
		boxRange
	}
}

function mergeLayers(one, two) {
	// TODO remove duplicate keys
	if (one && two) {
		return [...one, ...two];
	} else {
		return one || two || null;
	}
}

const mergeViews = createCachedSelector(
	[
		(one) => one,
		(one, two) => two,
		(one, two, three) => three
	],
	(one, two, three) => {
		three = three || {};
		return {...one, ...two, ...three};
	}
)(
	(one, two, three) => `${one}_${two}_${three || ""}`
);


function resetHeading(heading, callback, increment) {
	if (!increment) {
		increment = 1.0;
		if (Math.abs(heading) > 60) {
			increment = 2.0;
		} else if (Math.abs(heading) > 120) {
			increment = 3.0;
		}
		//set shortest direction based on angle
		if (heading > 0 && heading < 180 || heading < 0 && heading < -180) {
			increment = -increment;
		}
	}

	setTimeout(() => {
		if (Math.abs(heading) > Math.abs(increment)) {
			heading = heading + increment;
			callback(heading);
			resetHeading(heading, callback, increment);
		} else {
			heading = 0;
			callback(heading);
		}
	}, 20)
}


export default {
	ensureViewIntegrity: ensureViewIntegrity,
	getLocationFromPlaceString,
	getViewFromGeometry,
	mergeLayers,
	mergeViews,
	resetHeading,
}



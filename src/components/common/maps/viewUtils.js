import {zoomCoefficient, numberOfLevels} from './constants';

// TODO naive
/**
 * Convert box range to zoom level
 * @param view {Object}
 * @return {number} zoom level
 */
function getZoomLevelFromView(view) {
	let latitude = view.center.lat;
	let coeff = (zoomCoefficient*Math.abs(Math.cos(Math.PI*latitude/180)));
	let zoomLevel = Math.floor(Math.log(view.boxRange/coeff) / Math.log(2));

	if (zoomLevel > numberOfLevels) {
		zoomLevel = numberOfLevels;
	}

	return numberOfLevels - zoomLevel;
}

function getBoxRangeFromZoomLevelAndLatitude(level, latitude) {
	let coeff = (zoomCoefficient*Math.abs(Math.cos(Math.PI*latitude/180)));
	return coeff*Math.pow(2, numberOfLevels - level);
}

export default {
	getBoxRangeFromZoomLevelAndLatitude,
	getZoomLevelFromView
}
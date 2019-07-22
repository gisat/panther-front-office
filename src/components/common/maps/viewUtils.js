import {zoomCoefficient, numberOfLevels} from './constants';

// TODO naive
/**
 * Convert box range to zoom level
 * @param boxRange {number} range in meters
 * @return {number} zoom level
 */
function getZoomLevelFromBoxRange(boxRange) {
	let zoomLevel = Math.floor(Math.log(boxRange/zoomCoefficient) / Math.log(2));

	if (zoomLevel > numberOfLevels) {
		zoomLevel = numberOfLevels;
	}

	return numberOfLevels - zoomLevel;
}

function getBoxRangeFromZoomLevel(level) {
	return zoomCoefficient*Math.pow(2, numberOfLevels - level);
}

export default {
	getBoxRangeFromZoomLevel,
	getZoomLevelFromBoxRange
}
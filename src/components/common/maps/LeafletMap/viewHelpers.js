const LEVELS = 18;
const ZOOM_COEFF = 256;

function getLeafletViewFromViewParams(view) {
	let leafletView = {
		center: view.center,
		zoom: null
	};

	if (view.boxRange) {
		leafletView.zoom = getZoomLevelFromBoxRange(view.boxRange);
	}

	return leafletView;
}

function update(map, view) {
	let stateCenter = map.getCenter();
	let stateZoom = map.getZoom();

	let leafletUpdate = getLeafletViewFromViewParams(view);

	if (stateCenter.lat !== leafletUpdate.center.lat || stateCenter.lon !== leafletUpdate.center.lon){
		map.setView(leafletUpdate.center || stateCenter, leafletUpdate.zoom || stateZoom);
	}
}

// TODO naive
/**
 * Convert box range to zoom level
 * @param boxRange {number} range in meters
 * @return {number} zoom level
 */
function getZoomLevelFromBoxRange(boxRange) {
	let zoomLevel = Math.floor(Math.log(boxRange/ZOOM_COEFF) / Math.log(2));

	if (zoomLevel > LEVELS) {
		zoomLevel = LEVELS;
	}

	return LEVELS - zoomLevel;
}

function getBoxRangeFromZoomLevel(level) {
	return ZOOM_COEFF*Math.pow(2, LEVELS - level);
}

export default {
	getBoxRangeFromZoomLevel,
	getZoomLevelFromBoxRange,

	update
}
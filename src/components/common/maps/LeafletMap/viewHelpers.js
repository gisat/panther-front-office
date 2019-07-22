import viewUtils from '../viewUtils';

function getLeafletViewFromViewParams(view) {
	let leafletView = {
		center: view.center,
		zoom: null
	};

	if (view.boxRange) {
		leafletView.zoom = viewUtils.getZoomLevelFromBoxRange(view.boxRange);
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

export default {
	update
}
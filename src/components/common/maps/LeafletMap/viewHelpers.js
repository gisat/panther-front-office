import viewUtils from '../viewUtils';

function getLeafletViewFromViewParams(view) {
	let leafletView = {
		center: {
			lat: view.center.lat,
			lng: view.center.lon
		},
		zoom: null
	};

	if (view.boxRange) {
		leafletView.zoom = viewUtils.getZoomLevelFromView(view);
	}

	return leafletView;
}

function update(map, view) {
	let stateCenter = map.getCenter();
	let stateZoom = map.getZoom();

	let leafletUpdate = getLeafletViewFromViewParams(view);

	if (stateCenter.lat !== leafletUpdate.center.lat || stateCenter.lng !== leafletUpdate.center.lng || stateZoom !== leafletUpdate.zoom){
		map.setView(leafletUpdate.center || stateCenter, leafletUpdate.zoom || stateZoom);
	}
}

export default {
	update
}
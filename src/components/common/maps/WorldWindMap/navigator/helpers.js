
function getChangedViewParams(prev, next) {
		let changed = {};

		if (prev.boxRange !== next.boxRange){
			changed.boxRange = next.boxRange;
		}

		if (prev.heading !== next.heading){
			changed.heading = next.heading;
		}

		if (prev.tilt !== next.tilt){
			changed.tilt = next.tilt;
		}

		if (prev.roll !== next.roll){
			changed.roll = next.roll;
		}

		if ((prev.center.lat !== next.center.lat) ||
			(prev.center.lon !== next.center.lon) ) {
			changed.center = {
				lat: next.center.lat,
				lon: next.center.lon
			}
		}

		return changed;
}

/**
 * Update navigator of given World Window
 * @param wwd {WorldWindow}
 * @param view {Object}
 */
function update(wwd, view) {
	let state = wwd.navigator;
	let wwdUpdate = getWorldWindNavigatorFromViewParams(view);
	
	let shouldRedraw = false;

	if (wwdUpdate.range && state.range !== wwdUpdate.range){
		state.range = wwdUpdate.range;
		shouldRedraw = true;
	}

	if (wwdUpdate.tilt && state.tilt !== wwdUpdate.tilt){
		state.tilt = wwdUpdate.tilt;
		shouldRedraw = true;
	}

	if (wwdUpdate.roll && state.roll !== wwdUpdate.roll){
		state.roll = wwdUpdate.roll;
		shouldRedraw = true;
	}

	if (wwdUpdate.heading && state.heading !== wwdUpdate.heading){
		state.heading = wwdUpdate.heading;
		shouldRedraw = true;
	}

	if (wwdUpdate.lookAtLocation && wwdUpdate.lookAtLocation.latitude && state.lookAtLocation.latitude !== wwdUpdate.lookAtLocation.latitude){
		state.lookAtLocation.latitude = wwdUpdate.lookAtLocation.latitude;
		shouldRedraw = true;
	}

	if (wwdUpdate.lookAtLocation && wwdUpdate.lookAtLocation.longitude && state.lookAtLocation.longitude !== wwdUpdate.lookAtLocation.longitude){
		state.lookAtLocation.longitude = wwdUpdate.lookAtLocation.longitude;
		shouldRedraw = true;
	}

	// if (wwd.verticalExaggeration && wwdUpdate.elevation && wwd.verticalExaggeration !== wwdUpdate.elevation){
	// 	wwd.verticalExaggeration = wwdUpdate.elevation;
	// 	shouldRedraw = true;
	// }

	if (shouldRedraw) {
		wwd.redraw();
	}
}

/**
 * Convert view to World Wind Navigator params
 * @param view {Object}
 * @returns {WorldWind.Navigator}
 */
function getWorldWindNavigatorFromViewParams(view) {
	let {center, boxRange, ...navigator} = view;

	if (boxRange) {
		navigator.range = boxRange;
	}

	if (center) {
		navigator.lookAtLocation = {};
		if (center.lat) {
			navigator.lookAtLocation.latitude = center.lat;
		}
		if (center.lon) {
			navigator.lookAtLocation.longitude = center.lon;
		}
	}

	return navigator;
}


function getViewParamsFromWorldWindNavigator(navigator) {
	let {lookAtLocation, range, ...view} = navigator;

	if (range) {
		view.boxRange = range;
	}

	if (lookAtLocation) {
		view.center = {};
		if (lookAtLocation.latitude) {
			view.center.lat = lookAtLocation.latitude;
		}
		if (lookAtLocation.longitude) {
			view.center.lon = lookAtLocation.longitude;
		}
	}

	return view;
}

export default {
	getChangedViewParams,
	getViewParamsFromWorldWindNavigator,
	update
}
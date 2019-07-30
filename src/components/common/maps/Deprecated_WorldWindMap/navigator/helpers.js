/**
 * Get only changed navigator params
 * @param prev {Object} Previous WorldWind.Navigator params
 * @param next {Navigator}
 * @returns {Object} Changed WorldWind.Navigator parameters
 */
function getChangedParams(prev, next) {
	let changed = {};

	if (prev.range !== next.range){
		changed.range = next.range;
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

	if ((prev.lookAtLocation.latitude !== next.lookAtLocation.latitude) ||
		(prev.lookAtLocation.longitude !== next.lookAtLocation.longitude) ) {
		changed.lookAtLocation = {
			latitude: next.lookAtLocation.latitude,
			longitude: next.lookAtLocation.longitude
		}
	}

	return changed;
}

/**
 * Update navigator of given World Window
 * @param wwd {WorldWindow}
 * @param update {Object}
 * @param update.range {LookAtNavigator.range}
 * @param update.tilt {LookAtNavigator.tilt}
 * @param update.roll {LookAtNavigator.roll}
 * @param update.heading {LookAtNavigator.heading}
 * @param update.elevation {number}
 * @param update.lookAtLocation {LookAtNavigator.lookAtLocation}
 */
function update(wwd, update) {
	let state = wwd.navigator;
	let shouldRedraw = false;

	if (state.range !== update.range){
		state.range = update.range;
		shouldRedraw = true;
	}

	if (state.tilt !== update.tilt){
		state.tilt = update.tilt;
		shouldRedraw = true;
	}

	if (state.roll !== update.roll){
		state.roll = update.roll;
		shouldRedraw = true;
	}

	if (state.heading !== update.heading){
		state.heading = update.heading;
		shouldRedraw = true;
	}

	if (state.lookAtLocation.latitude !== update.lookAtLocation.latitude){
		state.lookAtLocation.latitude = update.lookAtLocation.latitude;
		shouldRedraw = true;
	}

	if (state.lookAtLocation.longitude !== update.lookAtLocation.longitude){
		state.lookAtLocation.longitude = update.lookAtLocation.longitude;
		shouldRedraw = true;
	}

	if (wwd.verticalExaggeration && update.elevation && wwd.verticalExaggeration !== update.elevation){
		wwd.verticalExaggeration = update.elevation;
		shouldRedraw = true;
	}

	if (shouldRedraw) {
		wwd.redraw();
	}
}

export default {
	getChangedParams,
	update
}
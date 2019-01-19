/**
 * Update navigator of given World Window
 * @param wwd {WorldWindow}
 * @param update {Object}
 * @param update.range {LookAtNavigator.range}
 * @param update.tilt {LookAtNavigator.tilt}
 * @param update.roll {LookAtNavigator.roll}
 * @param update.heading {LookAtNavigator.heading}
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

	if (shouldRedraw) {
		wwd.redraw();
	}
}

export default {
	update
}
import { unregister } from './registerServiceWorker';
import _ from 'lodash';

import config from './config';
import apps from './apps';

import {initialize as initializeGTag} from './utils/gtag';
import {forceSetPassiveEvents} from './utils/events';

//Fix for passive events
forceSetPassiveEvents();


function start() {
	//configute Google Analytics
	if(config.gtag) {
		initializeGTag(config.gtag);
	}

	for (let app of apps) {
		if (
			(url.hostname === app.hostname) && (!app.path || url.pathname.startsWith(app.path))
		) {
			return app.app(app.path, app.hostname + app.path);
		} else if (((url.hostname === 'localhost' || _.includes(config.devHostnames, url.hostname)) && url.pathname.startsWith(app.devPath))) {
			return app.app(app.devPath, url.hostname);
		}
	}

	// TODO error page
	window.alert('Wrong URL');
}

let url = window.location;
if (url) {
	start();
}

unregister();

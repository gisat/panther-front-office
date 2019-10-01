import { unregister } from './registerServiceWorker';
import _ from 'lodash';

import config from './config';
import apps from './apps';

import {initialize as initializeGTag} from './utils/gtag';

const devIndex = (hostname) => import(/* webpackChunkName: "devIndex" */'./apps/_devIndex').then(module => {
	module.default(hostname);
});
const error = (url, error) => import(/* webpackChunkName: "devIndex" */'./apps/_error').then(module => {
	module.default(url, error);
});

function start() {
	//configute Google Analytics TODO REMOVE !!!!!!!!!!!!!!!…!!
	if(config.gtag) {
		initializeGTag(config.gtag);
	}
	
	let isDevHostname = (url.hostname === 'localhost' || _.includes(config.devHostnames, url.hostname));

	for (let app of apps) {
		if (
			(url.hostname === app.hostname) && (!app.path || url.pathname.startsWith(app.path))
		) {
			return app.app(app.path, app.hostname + app.path);
		} else if (isDevHostname && url.pathname.startsWith(app.devPath)) {
			return app.app(app.devPath, url.hostname);
		}
	}

	if (isDevHostname) {
		return devIndex(url.hostname);
	} else {
		return error(url, 404);
	}
}

let url = window.location;
if (url) {
	start();
}

unregister();

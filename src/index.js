import { unregister } from './registerServiceWorker';
import _ from 'lodash';

import config from './config';
import apps from './apps';

import {events, gTag} from 'panther-utils';

//Fix for passive events
events.forceSetPassiveEvents();


const devIndex = (hostname) => import(/* webpackChunkName: "devIndex" */'./apps/_devIndex').then(module => {
	module.default(hostname);
});
const error = (url, error) => import(/* webpackChunkName: "devIndex" */'./apps/_error').then(module => {
	module.default(url, error);
});

function start() {
	//configute Google Analytics TODO REMOVE !!!!!!!!!!!!!!!…!!
	if(config.gtag) {
		gTag.initialize(config.gtag);
	}
	
	let isDevHostname = (url.hostname === 'localhost' || _.includes(config.devHostnames, url.hostname));

	for (let app of apps) {
		if (isDevHostname) {
			//development server - todo use key directly instead of devPath?
			if (url.pathname.startsWith(app.devPath)) {
				return app.app(app.devPath, url.hostname);
			}
		} else {
			//production server
			if (app.urls) {
				//multiple urls set
				for (let appUrl of app.urls) {
					if ((url.hostname === appUrl.hostname) && (!appUrl.path || url.pathname.startsWith(appUrl.path))) {
						return app.app(appUrl.path, appUrl.hostname + appUrl.path);
					}
				}
			} else { //todo else or not else or not at all? (as-is, fallback, 'urls' only)
				//single url (backwards-compatible)
				if ((url.hostname === app.hostname) && (!app.path || url.pathname.startsWith(app.path))) {
					return app.app(app.path, app.hostname + app.path);
				}
			}
		}
		
	}

	//no app found
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

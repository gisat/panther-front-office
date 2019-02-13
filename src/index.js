import { unregister } from './registerServiceWorker';
import _ from 'lodash';

import config from './config';
import backOffice from './apps/backOffice';
import demo from './apps/demo';

import './index.css';

const apps = [
	{
		hostname: 'panther.gisat.cz',
		path: '/backoffice',
		devPath: '/backoffice',
		app: backOffice
	}, {
		hostname: 'panther.gisat.cz',
		path: null,
		devPath: '/demo',
		app: demo
	}
];

function start() {
	for (let app of apps) {
		if (
			(url.hostname === app.hostname) && (!app.path || url.pathname.startsWith(app.path))
		) {
			return app.app(app.path);
		} else if (((url.hostname === 'localhost' || _.includes(config.devHostnames, url.hostname)) && url.pathname.startsWith(app.devPath))) {
			return app.app(app.devPath);
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

import { unregister } from './registerServiceWorker';
import demo from './apps/demo';

let url = window.location;

if (url) {
	if (
		url.hostname === 'panther.gisat.cz'
		|| (url.hostname === 'localhost' && url.pathname.startsWith('/demo'))
	) {
		demo();
	} else {
		// todo error page
		window.alert('Wrong url');
	}
}

unregister();

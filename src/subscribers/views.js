import Action from '../state/Action';
import utils from '../utils/utils';

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'VIEWS_LOADED':
				// TODO add data to store
				break;
		}
	});
};
import Action from '../state/Action';
import utils from '../utils/utils';

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'PERIODS_LOADED':
				store.dispatch(Action.periods.add(utils.replaceIdWithKey(options)));
				break;
		}
	});
};
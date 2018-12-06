import Action from '../state/Action';
import utils from '../utils/utils';

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'SNAPSHOTS_CREATED':
				let data = {
					key: utils.guid(),
					data: options
				};
				store.dispatch(Action.snapshots.add(data));
				break;
		}
	});
};
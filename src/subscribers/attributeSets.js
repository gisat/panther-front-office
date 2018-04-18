import Action from '../state/Action';
import utils from '../utils/utils';
import watch from "redux-watch";
import Select from "../state/Select";

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'ATTRIBUTE_SETS_LOADED':
				store.dispatch(Action.attributeSets.add(utils.replaceIdWithKey(options)));
				break;
			case 'attributeSets#updateActive':
				store.dispatch(Action.attributeSets.updateActive(options.attributeSets));
				break;
		}
	});
};

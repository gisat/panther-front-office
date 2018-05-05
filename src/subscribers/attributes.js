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
			case 'ATTRIBUTES_LOADED':
				store.dispatch(Action.attributes.add(utils.replaceIdWithKey(options)));
				break;
		}
	});
};

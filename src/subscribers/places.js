import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";

let state = {};

export default store => {
	setEventListeners(store);
};


const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'PLACES_LOADED':
				store.dispatch(Action.places.add(utils.replaceIdWithKey(options)));
				break;
			case 'place#setActivePlace':
				store.dispatch(Action.places.setActiveKeys(options.data));
				break;
		}
	});
};

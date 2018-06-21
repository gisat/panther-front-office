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
				let oldModels = Select.attributeSets.getAttributeSets(store.getState());
				let newModels = utils.removeDuplicities(oldModels, options);
				if (newModels && newModels.length){
					store.dispatch(Action.attributeSets.add(newModels));
				}
				break;
			case 'attributeSets#updateActive':
				store.dispatch(Action.attributeSets.updateActive(options.attributeSets));
				break;
		}
	});
};

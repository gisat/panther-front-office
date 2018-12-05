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
			case 'STYLES_LOADED':
				let oldModels = Select.styles.getAll(store.getState());

				// use only vector or raster layer template and remove duplicities
				let newModels = utils.removeDuplicities(oldModels, options);

				if (newModels && newModels.length){
					store.dispatch(Action.styles.add(newModels));
				}
				break;
		}
	});
};
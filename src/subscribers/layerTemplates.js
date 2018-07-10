import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";

import _ from 'lodash';

let state = {};
export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'LAYER_TEMPLATES_LOADED':
				let oldModels = Select.layerTemplates.getTemplates(store.getState());

				// use only vector or raster layer template and remove duplicities
				let newModels = utils.removeDuplicities(oldModels, _.reject(options, {layerType: 'au'}));

				if (newModels && newModels.length){
					store.dispatch(Action.layerTemplates.add(newModels));
				}
				break;
		}
	});
};
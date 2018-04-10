import _ from 'lodash';
import watch from "redux-watch";

import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";

let state = {};

export default store => {
	setEventListeners(store);
};


const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'PLACES_LOADED':
				store.dispatch(Action.places.add(_.map(options, transform)));
				break;
			case 'place#setActivePlace':
				store.dispatch(Action.places.setActiveKeys(options.data));
				break;
		}
	});
};

const transform = model => {
	let {dataset, id, ...newModel} = model;
	newModel.key = model.id;
	newModel.scope = model.dataset;
	return newModel;
};

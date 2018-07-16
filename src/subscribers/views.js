import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";

import _ from 'lodash';

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'VIEWS_LOADED':
				let storedViews = Select.views.getViews(store.getState());
				let viewsToAdd = [];
				options.forEach((option) => {
					let storedView = _.find(storedViews, {key: option.id});
					if(!storedView) {
						viewsToAdd.push({key: option.id, ...option});
					}
				});
				store.dispatch(Action.views.add(viewsToAdd));
				break;
			case "VIEWS_ADD":
				store.dispatch(Action.views.add(options));
				break;
		}
	});
};
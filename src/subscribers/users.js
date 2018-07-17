import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';
import {geoBounds} from 'd3-geo';
import utils from "../utils/utils";

let state = {};

export default store => {
	setEventListeners(store);

};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'user#changed':
				store.dispatch(Action.users.update(options));
				store.dispatch(Action.components.overlays.views.checkForActiveUser());
				break;
			case "USERS_LOADED":
				let oldModels = Select.users.getUsers(store.getState());
				let newModels = utils.removeDuplicities(oldModels, options);
				if (newModels && newModels.length){
					store.dispatch(Action.users.add(newModels));
				}
				break;
			case "USER_GROUPS_LOADED":
				let oldModelsGroups = Select.userGroups.getGroups(store.getState());
				let newModelsGroups = utils.removeDuplicities(oldModelsGroups, options);
				if (newModelsGroups && newModelsGroups.length){
					store.dispatch(Action.userGroups.add(newModelsGroups));
				}
				break;
		}
	});
};
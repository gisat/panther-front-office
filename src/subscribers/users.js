import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';
import {geoBounds} from 'd3-geo';

let state = {};

export default store => {
	setEventListeners(store);

};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'user#changed':
				store.dispatch(Action.users.update(options));
				break;
			case "USERS_LOADED":
				store.dispatch(Action.users.add(_.map(options, transform)));
				break;
			case "USER_GROUPS_LOADED":
				store.dispatch(Action.userGroups.add(_.map(options, transform)));
				break;
		}
	});
};

const transform = model => {
	let {id, ...newModel} = model;
	newModel.key = model.id;
	return newModel;
};
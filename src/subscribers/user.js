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
				store.dispatch(Action.user.update(options));
				break;
		}
	});
};
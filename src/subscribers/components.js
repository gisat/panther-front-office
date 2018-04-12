import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';

let state = {};
export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'header#uploadDataClick':
				store.dispatch(Action.components.showUploadDataOverlay(true));
				break;
		}
	});
};
import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'header#uploadDataClick':
				store.dispatch(Action.components.handleUploadDataOverlay(true));
				break;
			case 'component#scenarioButtonClick':
				let open = Select.components.isScenariosWindowOpen(store.getState());
				store.dispatch(Action.components.handleWindowVisibility('scenarios', !open));
				break;
		}
	});
};
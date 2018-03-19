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
			case 'PERIODS_LOADED':
				store.dispatch(Action.periods.add(utils.replaceIdWithKey(options)));
				break;
			case 'periods#change':
			case 'periods#initial':
				onPeriodsChanged(store, options);
				break;
		}
	});
};

const onPeriodsChanged = (store, options, initial) => {
	if (options.length === 1){
		store.dispatch(Action.periods.setActiveKey(options[0]));
	}
};

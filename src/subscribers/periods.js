import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'PERIODS_LOADED':
				let oldModels = Select.periods.getPeriods(store.getState());
				let newModels = utils.removeDuplicities(oldModels, options);
				if (newModels && newModels.length){
					store.dispatch(Action.periods.add(newModels));
				}
				break;
			case 'periods#change':
			case 'periods#initial':
				onPeriodsChanged(store, options);
				break;
			default:
				break;
		}
	});
};

const onPeriodsChanged = (store, options, initial) => {
	if (options.length === 1){
		store.dispatch(Action.periods.setActiveKey(options[0]));
	}
};

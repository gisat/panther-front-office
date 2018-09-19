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
			case 'SELECTIONS_FILTER_UPDATE_BY_COLOUR':
				store.dispatch(Action.areas.selections.updateSelectionByColour(options.colour, options.attributeFilter));
				break;
			case 'SELECTIONS_ADD_ACTIVE_BY_COLOUR':
				store.dispatch(Action.areas.selections.addActiveKeyByColour(options.colour));
				break;
			case 'selection#activeCleared':
				store.dispatch(Action.areas.selections.removeActiveKeyByColour(options.color));
				break;
			case 'selection#everythingCleared':
				store.dispatch(Action.areas.selections.setActiveKeys(null));
				break;
		}
	});
};

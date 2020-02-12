import utils from '../../../utils/utils';
import {commonActionTypesDefinitions} from "../../../constants/ActionTypes";

export const szifLpisZmenovaRizeniActionTypesDefinitions = {
	LPIS_CHANGE_CASES: {
		ADD: null,
		ADD_UNRECEIVED: null,
		EDITED: {
			REMOVE: null,
			REMOVE_PROPERTY: null,
			UPDATE: null,
			REMOVE_ACTIVE: null,
		},
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null,
			CLEAR_ALL: null,
			CLEAR_INDEX: null,
		},
		LOAD: {
			ERROR: null,
			REQUEST: null
		},
		SET_ACTIVE_KEY: null,
		SET_ACTIVE_KEYS: null,
		USE: {
			INDEXED: {
				CLEAR: null,
				CLEAR_ALL: null,
				REGISTER: null
			},
			KEYS: {
				CLEAR: null,
				REGISTER: null
			}
		},
		UPDATE: null,
	},
	LPIS_CHANGE_CASES_EDITED: {
		CLEAR_EDITED_CASE: null,
		EDIT_ACTIVE_EDITED_CASE: null,
		CREATE_NEW_ACTIVE_EDITED_CASE: null,
		CLEAR_ACTIVE_EDITED_CASE_KEY: null,
	},
	LPIS_CHANGE_DATES: {
		SAVE_DATES: null,
		UPDATE: null,
	},
};

export default utils.deepKeyMirror({...commonActionTypesDefinitions, ...szifLpisZmenovaRizeniActionTypesDefinitions});


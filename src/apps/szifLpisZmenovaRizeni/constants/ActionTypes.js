import {utils} from "panther-utils"
import {commonActionTypesDefinitions} from "../../../constants/ActionTypes";

export const szifLpisZmenovaRizeniActionTypesDefinitions = {
	LPIS_CHANGE_CASES: {
		ADD: null,
		ADD_UNRECEIVED: null,
		EDITED: {
			REMOVE: null,
			REMOVE_PROPERTY: null,
			UPDATE: null,
		},
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null,
			CLEAR_ALL: null
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
				REGISTER: null
			},
			KEYS: {
				CLEAR: null,
				REGISTER: null
			}
		}
	}
};

export default utils.deepKeyMirror({...commonActionTypesDefinitions, ...szifLpisZmenovaRizeniActionTypesDefinitions});


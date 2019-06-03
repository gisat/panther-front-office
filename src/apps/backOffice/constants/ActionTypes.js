import utils from '../../../utils/utils';
import {commonActionTypesDefinitions} from "../../../constants/ActionTypes";

export const backOfficeActionTypesDefinitions = {
	APPS: {
		ADD: null,
		ADD_UNRECEIVED: null,
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
		SET_MANAGED: null,
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

export default utils.deepKeyMirror({...commonActionTypesDefinitions, ...backOfficeActionTypesDefinitions});


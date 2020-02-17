import {utils} from "panther-utils"
import {commonActionTypesDefinitions} from "../../../constants/ActionTypes";

export const backOfficeActionTypesDefinitions = {
	APPS: {
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
	},
	
	CONFIGURATIONS: {
		ADD: null,
		ADD_UNRECEIVED: null,
		DELETE: null,
		MARK_DELETED: null,
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
				REGISTER: null
			},
			KEYS: {
				CLEAR: null,
				REGISTER: null
			},
			INDEXED_BATCH: {
				REGISTER: null
			}
		}
	},
};

export default utils.deepKeyMirror({...commonActionTypesDefinitions, ...backOfficeActionTypesDefinitions});


import utils from '@gisatcz/ptr-utils';

export default utils.deepKeyMirror({
	SAMPLE: {
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
			CLEAR_INDEX: null,
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
});


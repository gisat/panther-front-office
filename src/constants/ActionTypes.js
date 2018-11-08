import utils from '../utils/utils';

export default utils.deepKeyMirror({

	INITIALIZE: 'INITIALIZE',

	AOI_ADD: 'AOI_ADD',
	AOI_SET_ACTIVE: 'AOI_SET_ACTIVE',
	AOI_REQUEST: 'AOI_REQUEST',
	AOI_RECEIVE: 'AOI_RECEIVE',
	AOI_REQUEST_ERROR: 'AOI_REQUEST_ERROR',
	AOI_GEOMETRY_RECEIVE: 'AOI_GEOMETRY_RECEIVE',
	AOI_GEOMETRY_REQUEST_ERROR: 'AOI_GEOMETRY_REQUEST_ERROR',

	AREAS_SELECTIONS_ADD: 'AREAS_SELECTIONS_ADD',
	AREAS_SELECTIONS_SET_ACTIVE_MULTIPLE: 'AREAS_SELECTIONS_SET_ACTIVE_MULTIPLE',
	AREAS_SELECTIONS_UPDATE: 'AREAS_SELECTIONS_UPDATE',

	ATTRIBUTES: {
		ADD: null,
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null
		},
		LOAD: {
			ERROR: null,
			REQUEST: null
		},
		INITIALIZE_FOR_EXT: null, // TODO It will be removed along with Ext
		SET_ACTIVE_KEY: null,
		SET_ACTIVE_KEYS: null
	},

	ATTRIBUTE_SETS: {
		ADD: null,
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null
		},
		LOAD: {
			ERROR: null,
			REQUEST: null
		},
		INITIALIZE_FOR_EXT: null, // TODO It will be removed along with Ext
		SET_ACTIVE_KEY: null,
		SET_ACTIVE_KEYS: null
	},

	CHOROPLETHS_SET_ACTIVE_KEYS: 'CHOROPLETHS_SET_ACTIVE_KEYS',
	CHOROPLETHS_UPDATE: 'CHOROPLETHS_UPDATE',

	COMPONENTS_UPDATE: 'COMPONENTS_UPDATE',
	COMPONENTS_OVERLAY_UPDATE: 'COMPONENTS_OVERLAY_UPDATE',
	COMPONENTS_WINDOW_UPDATE: 'COMPONENTS_WINDOW_UPDATE',

	COMPONENTS_OVERLAY_MAP_EDITING_COPY_PROGRESS: 'COMPONENTS_OVERLAY_MAP_EDITING_COPY_PROGRESS',
	COMPONENTS_OVERLAY_MAP_EDITING_COPY_RECEIVE: 'COMPONENTS_OVERLAY_MAP_EDITING_COPY_RECEIVE',
	COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST: 'COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST',
	COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST_ERROR: 'COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST_ERROR',

	DATAVIEWS_REMOVE: 'DATAVIEWS_REMOVE',
	DATAVIEWS_DELETE_RECEIVE: 'DATAVIEWS_DELETE_RECEIVE',
	DATAVIEWS_DELETE_REQUEST: 'DATAVIEWS_DELETE_REQUEST',
	DATAVIEWS_DELETE_REQUEST_ERROR: 'DATAVIEWS_DELETE_REQUEST_ERROR',

	DATAVIEWS: {
		ADD: null,
		INDEX: {
			ADD: null
		},
		SET_ACTIVE_KEY: null,
		USE: {
			INDEXED: {
				CLEAR: null,
				REGISTER: null
			}
		}
	},

	LAYER_PERIODS_AOI_LAYER_REQUEST: 'LAYER_PERIODS_AOI_LAYER_REQUEST',
	LAYER_PERIODS_AOI_LAYER_REQUEST_ERROR: 'LAYER_PERIODS_AOI_LAYER_REQUEST_ERROR',
	LAYER_PERIODS_AOI_LAYER_RECEIVE: 'LAYER_PERIODS_AOI_LAYER_RECEIVE',
	LAYER_PERIODS_PLACE_LAYER_REQUEST: 'LAYER_PERIODS_PLACE_LAYER_REQUEST',
	LAYER_PERIODS_PLACE_LAYER_REQUEST_ERROR: 'LAYER_PERIODS_PLACE_LAYER_REQUEST_ERROR',
	LAYER_PERIODS_PLACE_LAYER_RECEIVE: 'LAYER_PERIODS_PLACE_LAYER_RECEIVE',
	LAYER_PERIODS_KEY_LAYER_REQUEST: 'LAYER_PERIODS_KEY_LAYER_REQUEST',
	LAYER_PERIODS_KEY_LAYER_REQUEST_ERROR: 'LAYER_PERIODS_KEY_LAYER_REQUEST_ERROR',
	LAYER_PERIODS_KEY_LAYER_RECEIVE: 'LAYER_PERIODS_KEY_LAYER_RECEIVE',

	LAYER_TEMPLATES_ADD: 'LAYER_TEMPLATES_ADD',

	MAPS_ADD: 'MAPS_ADD',
	MAPS_REMOVE: 'MAPS_REMOVE',
	MAPS_UPDATE: 'MAPS_UPDATE',
	MAPS_UPDATE_DEFAULTS: 'MAPS_UPDATE_DEFAULTS',
	MAPS_SET_ACTIVE: 'MAPS_SET_ACTIVE',
	MAPS_SET_INDEPENDENT_OF_PERIOD: 'MAPS_SET_INDEPENDENT_OF_PERIOD',

	PERIODS: {
		ADD: null,
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null
		},
		LOAD: {
			ERROR: null,
			REQUEST: null
		},
		SET_ACTIVE_KEY: null,
		SET_ACTIVE_KEYS: null
	},

	PLACES_ADD: 'PLACES_ADD',
	PLACES_SET_ACTIVE: 'PLACES_SET_ACTIVE',
	PLACES_SET_ACTIVE_MULTI: 'PLACES_SET_ACTIVE_MULTI',

	PLACES: {
		ADD: null,
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null
		},
		LOAD: {
			ERROR: null,
			REQUEST: null
		},
		SET_ACTIVE_KEY: null,
		SET_ACTIVE_KEYS: null,
		INITIALIZE_FOR_EXT: null, // TODO It will be removed along with Ext
	},

	REDIRECT_TO_VIEW: 'REDIRECT_TO_VIEW',

	SCENARIOS_ADD: 'SCENARIOS_ADD',
	SCENARIOS_EDITED_UPDATE: 'SCENARIOS_EDITED_UPDATE',
	SCENARIOS_EDITED_REMOVE: 'SCENARIOS_EDITED_REMOVE',
	SCENARIOS_EDITED_REMOVE_PROPERTY: 'SCENARIOS_EDITED_REMOVE_PROPERTY',
	SCENARIOS_SET_ACTIVE: 'SCENARIOS_SET_ACTIVE',
	SCENARIOS_SET_ACTIVE_MULTI: 'SCENARIOS_SET_ACTIVE_MULTI',
	SCENARIOS_SET_DEFAULT_SITUATION_ACTIVE: 'SCENARIOS_SET_DEFAULT_SITUATION_ACTIVE',
	SCENARIOS_CASES_ADD: 'SCENARIOS_CASES_ADD',
	SCENARIOS_CASES_REMOVE: 'SCENARIOS_CASES_REMOVE',
	SCENARIOS_CASES_SET_ACTIVE: 'SCENARIOS_CASES_SET_ACTIVE',
	SCENARIOS_UPDATE: 'SCENARIOS_UPDATE',
	SCENARIOS_REQUEST: 'SCENARIOS_REQUEST',
	SCENARIOS_RECEIVE: 'SCENARIOS_RECEIVE',
	SCENARIOS_REQUEST_ERROR: 'SCENARIOS_REQUEST_ERROR',
	SCENARIOS_CASES_REQUEST: 'SCENARIOS_CASES_REQUEST',
	SCENARIOS_CASES_RECEIVE: 'SCENARIOS_CASES_RECEIVE',
	SCENARIOS_CASES_REQUEST_ERROR: 'SCENARIOS_CASES_REQUEST_ERROR',
	SCENARIOS_CASES_UPDATE: 'SCENARIOS_CASES_UPDATE',
	SCENARIOS_CASES_EDITED_UPDATE: 'SCENARIOS_CASES_EDITED_UPDATE',
	SCENARIOS_CASES_EDITED_REMOVE: 'SCENARIOS_CASES_EDITED_REMOVE',
	SCENARIOS_CASES_EDITED_REMOVE_ACTIVE: 'SCENARIOS_CASES_EDITED_REMOVE_ACTIVE',
	SCENARIOS_CASES_EDITED_REMOVE_PROPERTY: 'SCENARIOS_CASE_EDITED_REMOVE_PROPERTY',

	SCENARIOS_API_PROCESSING_FILE_STARTED: 'SCENARIOS_API_PROCESSING_FILE_STARTED',
	SCENARIOS_API_PROCESSING_FILE_SUCCESS: 'SCENARIOS_API_PROCESSING_FILE_SUCCESS',
	SCENARIOS_API_PROCESSING_FILE_ERROR: 'SCENARIOS_API_PROCESSING_FILE_ERROR',

	SCENARIOS_CASES_API_CREATE_REQUEST: 'SCENARIOS_CASES_API_CREATE_REQUEST',
	SCENARIOS_CASES_API_CREATE_RECEIVE: 'SCENARIOS_CASES_API_CREATE_RECEIVE',
	SCENARIOS_CASES_API_CREATE_ERROR: 'SCENARIOS_CASES_API_CREATE_ERROR',
	SCENARIOS_CASES_API_DELETE_REQUEST: 'SCENARIOS_CASES_API_DELETE_REQUEST',
	SCENARIOS_CASES_API_DELETE_RECEIVE: 'SCENARIOS_CASES_API_DELETE_RECEIVE',
	SCENARIOS_CASES_API_DELETE_ERROR: 'SCENARIOS_CASES_API_DELETE_ERROR',
	SCENARIOS_CASES_API_UPDATE_REQUEST: 'SCENARIOS_CASES_API_UPDATE_REQUEST',
	SCENARIOS_CASES_API_UPDATE_RECEIVE: 'SCENARIOS_CASES_API_UPDATE_RECEIVE',
	SCENARIOS_CASES_API_UPDATE_ERROR: 'SCENARIOS_CASES_API_UPDATE_ERROR',

	SCOPES: {
		ADD: null,
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null
		},
		LOAD: {
			ERROR: null,
			REQUEST: null
		},
		SET_ACTIVE_KEY: null
	},

	SPATIAL_RELATIONS_RECEIVE: 'SPATIAL_RELATIONS_RECEIVE',
	SPATIAL_RELATIONS_REQUEST: 'SPATIAL_RELATIONS_REQUEST',
	SPATIAL_RELATIONS_REQUEST_ERROR: 'SPATIAL_RELATIONS_REQUEST_ERROR',

	SPATIAL_DATA_SOURCES_DOWNLOAD_FILE_ERROR: 'SPATIAL_DATA_SOURCES_DOWNLOAD_FILE_ERROR',
	SPATIAL_DATA_SOURCES_DOWNLOAD_FILE_REQUEST: 'SPATIAL_DATA_SOURCES_DOWNLOAD_FILE_REQUEST',
	SPATIAL_DATA_SOURCES_RECEIVE: 'SPATIAL_DATA_SOURCES_RECEIVE',
	SPATIAL_DATA_SOURCES_REQUEST: 'SPATIAL_DATA_SOURCES_REQUEST',
	SPATIAL_DATA_SOURCES_FILTERED_REQUEST: 'SPATIAL_DATA_SOURCES_FILTERED_REQUEST',
	SPATIAL_DATA_SOURCES_REQUEST_ERROR: 'SPATIAL_DATA_SOURCES_REQUEST_ERROR',

	SPATIAL_DATA_SOURCES_ADD: 'SPATIAL_DATA_SOURCES_ADD',
	SPATIAL_DATA_SOURCES_VECTOR_FEATURES_RECEIVE: 'SPATIAL_DATA_SOURCES_VECTOR_FEATURES_RECEIVE',
	SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST: 'SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST',
	SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST_ERROR: 'SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST_ERROR',
	SPATIAL_DATA_SOURCES_VECTOR_FEATURES_POINT_REQUEST: 'SPATIAL_DATA_SOURCES_VECTOR_FEATURES_POINT_REQUEST',
	SPATIAL_DATA_SOURCES_VECTOR_FEATURES_POINT_REQUEST_ERROR: 'SPATIAL_DATA_SOURCES_VECTOR_FEATURES_POINT_REQUEST_ERROR',
	SPATIAL_DATA_SOURCES_VECTOR_FEATURES_SELECT: 'SPATIAL_DATA_SOURCES_VECTOR_FEATURES_SELECT',
	SPATIAL_DATA_SOURCES_VECTOR_FEATURES_EDITED_ADD: 'SPATIAL_DATA_SOURCES_VECTOR_FEATURES_EDITED_ADD',

	STYLES_ADD: 'STYLES_ADD',

	THEMES: {
		ADD: null,
		ENSURE: {
			ERROR: null
		},
		INDEX: {
			ADD: null
		},
		LOAD: {
			ERROR: null,
			REQUEST: null
		},
		SET_ACTIVE_KEY: null,
		SET_ACTIVE_KEYS: null
	},

	USERS: {
		LOGOUT: null
	},

	USERS_ADD: 'USERS_ADD',
	USERS_LOAD_REQUEST: 'USERS_LOAD_REQUEST',
	USERS_LOAD_REQUEST_ERROR: 'USERS_LOAD_REQUEST_ERROR',
    USERS_LOAD_CURRENT_REQUEST: 'USERS_LOAD_CURRENT_REQUEST',
    USERS_LOAD_CURRENT_REQUEST_ERROR: 'USERS_LOAD_CURRENT_REQUEST_ERROR',
    USERS_LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
    USERS_LOGIN_REQUEST_ERROR: 'USERS_LOGIN_REQUEST_ERROR',
    USERS_LOGOUT_REQUEST: 'USERS_LOGOUT_REQUEST',
    USERS_LOGOUT_REQUEST_ERROR: 'USERS_LOGOUT_REQUEST_ERROR',
	USERS_UPDATE: 'USERS_UPDATE',
	USER_GROUPS_ADD: 'USER_GROUPS_ADD',

	WMS_LAYERS_ADD: 'WMS_LAYERS_ADD',

	LPIS_CASES_ADD: 'LPIS_CASES_ADD',
	LPIS_CASE_CHANGES_ADD: 'LPIS_CASE_CHANGES_ADD',
	LPIS_CASES_SEARCH_STRING_CHANGE: 'LPIS_CASES_SEARCH_STRING_CHANGE',
	LPIS_CASES_SELECTED_STATUS_CHANGE: 'LPIS_CASES_SELECTED_STATUS_CHANGE',
	LPIS_CASES_EDIT_ACTIVE_EDITED_CASE: 'LPIS_CASES_EDIT_ACTIVE_EDITED_CASE',
	LPIS_CASES_CREATE_NEW_ACTIVE_EDITED_CASE: 'LPIS_CASES_CREATE_NEW_ACTIVE_EDITED_CASE',
	LPIS_CASES_REMOVE_EDITED_CASES_BY_KEYS: 'LPIS_CASES_REMOVE_EDITED_CASES_BY_KEYS',
	LPIS_CASES_SET_ACTIVE: 'LPIS_CASES_SET_ACTIVE',
	LPIS_CASES_CLEAR_EDITED_CASE: 'LPIS_CASES_CLEAR_EDITED_CASE',
	LPIS_CASE_EDIT_ACTIVE_CASE: 'LPIS_CASE_EDIT_ACTIVE_CASE',
	LPIS_CASE_EDIT_ACTIVE_CASE_STATUS: 'LPIS_CASE_EDIT_ACTIVE_CASE_STATUS',
	LPIS_CASE_EDIT_CASE_STATUS: 'LPIS_CASE_EDIT_CASE_STATUS',
	LPIS_CASE_SET_NEXT_ACTIVE_CASE_KEY: 'LPIS_CASE_SET_NEXT_ACTIVE_CASE_KEY'
});

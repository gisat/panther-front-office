import ActionTypes from '../../constants/ActionTypes';
import request from "../_common/request";
import selectors from './selectors';
import commonActions from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const loadConfiguration = () => {
	return (dispatch, getState) => {
		const localConfig = Select.app.getCompleteLocalConfiguration(getState());
		const apiPath = 'backend/rest/applications/filtered/configurations';
		let applicationKey = selectors.getKey(getState());
		const payload = {
			filter: {
				applicationKey
			}
		};
		return request(localConfig, apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors.configurations || result.data && !result.data.configurations) {
					dispatch(commonActions.actionGeneralError(result.errors.configurations || new Error('no data')));
				} else if (result.data.configurations.length && result.data.configurations[0].data && result.data.configurations[0].data.data) {
					dispatch(actionReceiveConfiguration(result.data.configurations[0].data.data));
				} else {
					dispatch(commonActions.actionGeneralError(new Error('empty configuration')));
				}
			})
			.catch(error => {
				dispatch(commonActions.actionGeneralError(error));
			});
	};
};

// ============ actions ===========
const actionSetKey = (key) => {
	return {
		type: ActionTypes.APP.SET_KEY,
		key
	}
};
const actionSetBaseUrl = (url) => {
	return {
		type: ActionTypes.APP.SET_BASE_URL,
		url
	}
};
const actionSetLocalConfiguration = (path, value) => {
	return {
		type: ActionTypes.APP.SET_LOCAL_CONFIGURATION,
		path,
		value
	}
};
const actionUpdateLocalConfiguration = (update) => {
	return {
		type: ActionTypes.APP.UPDATE_LOCAL_CONFIGURATION,
		update
	}
};
const actionReceiveConfiguration = (configuration) => {
	return {
		type: ActionTypes.APP.RECEIVE_CONFIGURATION,
		configuration
	}
};

// ============ export ===========

export default {
	add: actionReceiveConfiguration,
	setKey: actionSetKey,
	updateLocalConfiguration: actionUpdateLocalConfiguration,
	setBaseUrl: actionSetBaseUrl,
	setLocalConfiguration: actionSetLocalConfiguration,
	loadConfiguration
}

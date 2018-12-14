import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";

import utils from '../../utils/utils';

import common from '../_common/actions';

import scopeActions from '../Scopes/actions';
import lpisCasesActions from '../LpisCases/actions';
import dataViewActions from '../Dataviews/actions';
import overlaysActions from '../Components/Overlays/actions';
import userGroupsActions from '../UserGroups/actions';

import Action from '../Action';

import User from "../../data/User";
import Group from "../../data/Group";

const TTL = 5;

// ============ creators ===========

const add = common.add(ActionTypes.USERS);
const setActiveKey = common.setActiveKey(ActionTypes.USERS);

function onLogin() {
	return (dispatch) => {
		dispatch(common.actionDataSetOutdated());
		dispatch(apiLoadCurrentUser());
		dispatch(overlaysActions.closeOverlay('login'));

		dispatch(Action.dataviews.refreshAllIndexes());
		dispatch(Action.scopes.refreshAllIndexes());
		dispatch(Action.places.refreshAllIndexes());
		dispatch(Action.periods.refreshAllIndexes());
		dispatch(Action.themes.refreshAllIndexes());
	}
}

function onLogout() {
	return (dispatch) => {
		dispatch(actionLogout());
		dispatch(setActiveKey(null));
		dispatch(Action.dataviews.refreshAllIndexes());
		dispatch(Action.scopes.refreshAllIndexes());
		dispatch(Action.places.refreshAllIndexes());
		dispatch(Action.periods.refreshAllIndexes());
		dispatch(Action.themes.refreshAllIndexes());
	}
}

function update(user) {
	return dispatch => {
		dispatch(actionUpdate(user));
	};
}

function apiLoginUser(email, password, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiLoginRequest());

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/api/login/login');

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				username: email,
				password: password
			})
		}).then(
			response => {
				console.log('#### login user response', response);
				if (response.ok) {
					dispatch(onLogin());
				} else {
					dispatch(actionApiLoginRequestError('user#action login Problem with logging in the User, please try later.'));
				}
			},
			error => {
				console.log('#### login user error', error);
				if (ttl - 1) {
					dispatch(apiLoginUser(ttl - 1));
				} else {
					dispatch(actionApiLoginRequestError('user#action login Problem with logging in the User, please try later.'));
				}
			}
		);
	};
}

function apiLoad(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		let state = getState();
		if (state.users.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionApiLoadRequest());

			let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/user');

			return fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(
				response => {
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(data => {
							Promise.all(data.data.map(user => {
								return new User({data: user}).then(user => {
									user.key = user.id;
									return user;
								});
							})).then(users => {
								dispatch(actionAdd(users));
							});
						});
					} else {
						dispatch(actionApiLoadRequestError('scopes#action Problem with loading scopes.'));
					}
				},
				error => {
					if (ttl - 1) {
						dispatch(apiLoad(ttl - 1));
					} else {
						dispatch(actionApiLoadRequestError('scopes#action Problem with loading scopes.'));
					}
				}
			);
		}
	};
}

function apiLoadCurrentUser(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiLoadCurrentUserRequest());

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/logged');

		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(
			response => {
				console.log('#### load current user response', response);
				if (response.ok) {
					return response.json().then(body => {

						if (body._id === 0) {
							// no logged in user = guest
							dispatch(actionAddGroups(transformGroups(body.groups)));
						} else if (body._id) {
							// logged in user
							dispatch(setActiveKey(body._id));
							dispatch(add(transformUser(body)));
							dispatch(actionAddGroups(transformGroups(body.groups)));
						}


						// if (body._id != 0) {
						// 	new User({data: body}).then(user => {
						// 		user.key = user.id;
						// 		dispatch(actionAdd([user]));
						//
						// 		dispatch(actionUpdate({
						// 			userId: body._id,
						// 			isLoggedIn: true,
						// 			isAdmin: false
						// 		}));
						// 		dispatch(overlaysActions.closeOverlay('login'));
						// 	});
						// }
					});
				} else {
					dispatch(actionApiLoadCurrentUserRequestError('user#action loadCurrent Problem with loading current User, please try later.'));
				}
			},
			error => {
				console.log('#### load current users error', error);
				if (ttl - 1) {
					dispatch(apiLoadCurrentUser(ttl - 1));
				} else {
					dispatch(actionApiLoadCurrentUserRequestError('user#action loadCurrent Problem with loading current User, please try later.'));
				}
			}
		);
	};
}

function apiLogoutUser(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiLogoutRequest());

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/api/login/logout');

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(
			response => {
				console.log('#### logout user response', response);
				if (response.ok) {
					// window.location.reload();
					dispatch(onLogout());
				} else {
					dispatch(actionApiLogoutRequestError('user#action logout Problem with logging out the User, please try later.'));
				}
			},
			error => {
				console.log('#### logout user error', error);
				if (ttl - 1) {
					dispatch(apiLogoutUser(ttl - 1));
				} else {
					dispatch(actionApiLogoutRequestError('user#action logout Problem with logging out the User, please try later.'));
				}
			}
		);
	};
}

// ============ helpers ===========

function transformUser(body) {
	return {
		key: body._id,
		data: {
			email: body.email,
			name: body.name,
			phone: body.phone
		},
		groups: _.map(body.groups, '_id')
	}
}

function transformGroups(groups) {
	return _.map(groups, group => {
		return {
			key: group._id,
			data: {
				name: group.name
			}
		}
	});
}

// ============ actions ===========

function actionAdd(users) {
	return {
		type: ActionTypes.USERS.ADD,
		data: users
	}
}

function actionAddGroups(groups) {
	return {
		type: ActionTypes.USERS.GROUPS.ADD,
		data: groups
	}
}

function actionUpdate(user) {
	return {
		type: ActionTypes.USERS_UPDATE,
		data: user
	}
}

function actionApiLogoutRequest() {
	return {
		type: ActionTypes.USERS_LOGOUT_REQUEST
	}
}

function actionApiLogoutRequestError(error) {
	return {
		type: ActionTypes.USERS_LOGOUT_REQUEST_ERROR,
		error: error
	}
}

function actionApiLoadRequest() {
	return {
		type: ActionTypes.USERS_LOAD_REQUEST
	}
}

function actionApiLoadRequestError(error) {
	return {
		type: ActionTypes.USERS_LOAD_REQUEST_ERROR,
		error: error
	}
}

function actionApiLoginRequest() {
	return {
		type: ActionTypes.USERS_LOGIN_REQUEST
	}
}

function actionApiLoginRequestError(error) {
	return {
		type: ActionTypes.USERS_LOGIN_REQUEST_ERROR,
		error: error
	}
}

function actionApiLoadCurrentUserRequest() {
	return {
		type: ActionTypes.USERS_LOAD_CURRENT_REQUEST
	}
}

function actionApiLoadCurrentUserRequestError(error) {
	return {
		type: ActionTypes.USERS_LOAD_CURRENT_REQUEST_ERROR,
		error: error
	}
}

function actionLogout() {
	return {
		type: ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT
	}
}

// ============ export ===========

export default {
	add,
	apiLoad: apiLoad,
	apiLoadCurrentUser: apiLoadCurrentUser,
	apiLoginUser: apiLoginUser,
	apiLogoutUser: apiLogoutUser,
	update: update
}

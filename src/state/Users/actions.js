import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";

import request from "../_common/request";

import common from '../_common/actions';
import Select from "../Select";

import scopeActions from '../Scopes/actions';
import lpisCasesActions from '../_specific/LpisChangeReviewCases/actions';
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
const refreshUses = () => (dispatch) => {
	dispatch(common.refreshUses(Select.users.getSubstate, 'users', ActionTypes.USERS, 'user')());
	dispatch(common.refreshUses(Select.users.getGroupsSubstate, 'groups', ActionTypes.USERS.GROUPS, 'user')());
}

const useIndexedUsers = common.useIndexed(Select.users.getSubstate, 'users', ActionTypes.USERS, 'user');
const useIndexedGroups = common.useIndexed(Select.users.getGroupsSubstate, 'groups', ActionTypes.USERS.GROUPS, 'user');

function onLogin() {
	return (dispatch) => {
		dispatch(common.actionDataSetOutdated());
		dispatch(apiLoadCurrentUser());
		dispatch(overlaysActions.closeOverlay('login'));

		dispatch(Action.dataviews.loadActive());

		dispatch(Action.dataviews.refreshUses());
		dispatch(Action.scopes.refreshUses());
		dispatch(Action.places.refreshUses());
		dispatch(Action.periods.refreshUses());
		dispatch(Action.themes.refreshUses());
		dispatch(refreshUses());
	}
}

function onLogout() {
	return (dispatch) => {
		dispatch(actionLogout());
		dispatch(setActiveKey(null));

		dispatch(Action.dataviews.loadActive());

		dispatch(Action.dataviews.refreshUses());
		dispatch(Action.scopes.refreshUses());
		dispatch(Action.places.refreshUses());
		dispatch(Action.periods.refreshUses());
		dispatch(Action.themes.refreshUses());
		dispatch(refreshUses());
	}
}

function apiLoginUser(email, password) {
	return dispatch => {
		dispatch(actionApiLoginRequest());

		let payload = {
			username: email,
			password: password
		};

		return request('backend/api/login/login', 'POST', null, payload)
			.then(result => {
				if (result.data.status === "ok") {
					dispatch(onLogin());
				}
			})
			.catch(error => {
				dispatch(common.actionGeneralError(error));
				return error;
			});
	};
}

// function apiLoad(ttl) {
// 	if (_.isUndefined(ttl)) ttl = TTL;
// 	return (dispatch, getState) => {
// 		let state = getState();
// 		if (state.users.loading) {
// 			// already loading, do nothing
// 		} else {
// 			dispatch(actionApiLoadRequest());
//
// 			let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/user');
//
// 			return fetch(url, {
// 				method: 'GET',
// 				credentials: 'include',
// 				headers: {
// 					'Content-Type': 'application/json',
// 					'Accept': 'application/json'
// 				}
// 			}).then(
// 				response => {
// 					let contentType = response.headers.get('Content-type');
// 					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
// 						return response.json().then(data => {
// 							Promise.all(data.data.map(user => {
// 								return new User({data: user}).then(user => {
// 									user.key = user.id;
// 									return user;
// 								});
// 							})).then(users => {
// 								dispatch(actionAdd(users));
// 							});
// 						});
// 					} else {
// 						dispatch(actionApiLoadRequestError('scopes#action Problem with loading scopes.'));
// 					}
// 				},
// 				error => {
// 					if (ttl - 1) {
// 						dispatch(apiLoad(ttl - 1));
// 					} else {
// 						dispatch(actionApiLoadRequestError('scopes#action Problem with loading scopes.'));
// 					}
// 				}
// 			);
// 		}
// 	};
// }

function apiLoadCurrentUser() {
	return dispatch => {
		dispatch(actionApiLoadCurrentUserRequest());

		return request('backend/rest/user/current', 'GET', null, null)
			.then(result => {
				if (result.errors) { //todo how do we return errors here?
					throw new Error(result.errors);
				} else {
					if (result.key === 0) {
						// no logged in user = guest
						dispatch(actionAddGroups(transformGroups(result.groups)));
					} else if (result.key) {
						// logged in user
						dispatch(setActiveKey(result.key));
						dispatch(add(transformUser(result)));
						dispatch(actionAddGroups(transformGroups(result.groups)));
					}
				}
			})
			.catch(error => {
				dispatch(common.actionGeneralError(error));
				return error;
			});

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

function transformUser(user) {
	return {
		...user,
		//TODO remove -> workaround with permissions.guest.get
		permissions: {...user.permissions, guest: {get: false}},
		groups: _.map(user.groups, 'key'),

	}
}
//TODO remove -> workaround with permissions.guest.get
function transformGroups(groups) {
	return groups.map(group => ({...group, permissions: {guest: {get: false}}}))
}

// ============ actions ===========

function actionClearUsersUseIndexed(componentId) {
	return {
		type: ActionTypes.USERS.USE.INDEXED.CLEAR,
		componentId
	}
}

function actionClearGroupsUseIndexed(componentId) {
	return {
		type: ActionTypes.USERS.GROUPS.USE.INDEXED.CLEAR,
		componentId
	}
}

function actionAddGroups(groups) {
	return {
		type: ActionTypes.USERS.GROUPS.ADD,
		data: groups
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
		type: ActionTypes.USERS.LOGIN.REQUEST
	}
}

function actionApiLoadCurrentUserRequest() {
	return {
		type: ActionTypes.USERS.CURRENT.REQUEST
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
	// apiLoad: apiLoad,
	apiLoadCurrentUser: apiLoadCurrentUser,
	apiLoginUser: apiLoginUser,
	apiLogoutUser: apiLogoutUser,
	refreshUses,
	useIndexedUsers,
	useIndexedGroups,
	useIndexedUsersClear: actionClearUsersUseIndexed,
	useIndexedGroupsClear: actionClearGroupsUseIndexed,
	// update: update
}

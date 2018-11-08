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

import User from "../../data/User";
import Group from "../../data/Group";

const TTL = 5;

// ============= Common logic ===========
// TODO: Move Elsewhere.

function reloadData(dispatch) {
    // Reload scope
    dispatch(scopeActions.loadAll());
    // Reload current user
    dispatch(apiLoadCurrentUser());
	// Reload lpis cases
	dispatch(lpisCasesActions.load());
}

// ============ creators ===========

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
                    reloadData(dispatch);
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
                    return response.json().then(data => {
                        if(data._id != 0) {
                            new User({data: data}).then(user => {
                                user.key = user.id;
                                dispatch(actionAdd([user]));

                                dispatch(actionUpdate({
                                    userId: data._id,
                                    isLoggedIn: true,
                                    isAdmin: false
                                }));
                                dispatch(overlaysActions.closeOverlay('login'));
                            });
                        }
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
					dispatch(actionLogout());
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

// ============ actions ===========

function actionAdd(users) {
	return {
		type: ActionTypes.USERS_ADD,
		data: users
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
		type: ActionTypes.USERS.LOGOUT
	}
}

// ============ export ===========

export default {
	add: common.add(actionAdd),
    apiLoadCurrentUser: apiLoadCurrentUser,
	apiLoginUser: apiLoginUser,
	apiLogoutUser: apiLogoutUser,
	update: update
}

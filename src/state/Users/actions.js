import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";

const TTL = 5;

// ============ creators ===========

function add(users){
	return dispatch => {
		if (!_.isArray(users)) users = [users];
		dispatch(actionAdd(users));
	};
}

function update(user) {
	return dispatch => {
		dispatch(actionUpdate(user));
	};
}

function apiLoginUser(username, password, ttl) {
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
                username: username,
                password: password
            })
        }).then(
            response => {
                console.log('#### login user response', response);
                if (response.ok) {
                    window.location.reload();
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
                    window.location.reload();
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

// ============ export ===========

export default {
	add: add,
	apiLoginUser: apiLoginUser,
	apiLogoutUser: apiLogoutUser,
	update: update
}

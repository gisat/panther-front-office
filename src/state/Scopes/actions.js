import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import _ from 'lodash';
import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";
import queryString from 'query-string';

import common from '../_common/actions';

import Scope from '../../data/Scope';

const TTL = 5;

// ============ creators ===========

function setActiveScopeKey(key) {
	return dispatch => {
		dispatch(actionSetActiveScopeKey(key));
		dispatch(loadDataForActiveScope());
	};
}
function loadDataForActiveScope() {
	return (dispatch, getState) => {
		let activeScopeConfiguration = Select.scopes.getActiveScopeConfiguration(getState());
		if(activeScopeConfiguration && activeScopeConfiguration.hasOwnProperty(`dromasLpisChangeReview`)) {
			dispatch(Action.lpisCases.load());
		}
	}
}

function apiLoadScopes(ttl) {
    if (_.isUndefined(ttl)) ttl = TTL;
    return dispatch => {
        dispatch(actionApiLoadScopesRequest());

        let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/dataset');

        return fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(
            response => {
                console.log('#### load scopes response', response);
                let contentType = response.headers.get('Content-type');
                if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
                    return response.json().then(data => {
                        Promise.all(data.data.map(scope => {
                            return new Scope({data: scope}).then(scope => {
                                scope.key = scope.id;
                                return scope;
                            });
                        })).then(scopes => {
                            dispatch(actionAdd(scopes));
                        });
                    });
                } else {
                    dispatch(actionApiLoadScopesRequestError('scopes#action Problem with loading scopes.'));
                }
            },
            error => {
                console.log('#### load scopes error', error);
                if (ttl - 1) {
                    dispatch(apiLoadScopes(ttl - 1));
                } else {
                    dispatch(actionApiLoadScopesRequestError('scopes#action Problem with loading scopes.'));
                }
            }
        );
    };
}

// ============ actions ===========

function actionAdd(scopes) {
	return {
		type: ActionTypes.SCOPES_ADD,
		data: scopes
	}
}
function actionSetActiveScopeKey(key) {
	return {
		type: ActionTypes.SCOPES_SET_ACTIVE_KEY,
		key: key
	}
}

function actionApiLoadScopesRequest() {
    return {
        type: ActionTypes.SCOPES_LOAD_REQUEST
    }
}

function actionApiLoadScopesRequestError(error) {
    return {
        type: ActionTypes.SCOPES_LOAD_REQUEST_ERROR,
        error: error
    }
}

// ============ export ===========

export default {
	add: common.add(actionAdd),
	apiLoadScopes: apiLoadScopes,
	setActiveScopeKey: setActiveScopeKey
}

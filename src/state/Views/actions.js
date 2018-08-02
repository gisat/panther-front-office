import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import fetch from "isomorphic-fetch";
import config from "../../config";
import path from "path";
import queryString from 'query-string';
import Dataview from "../../data/Dataview";

const TTL = 5;

// ============ creators ===========

function add(views) {
	return dispatch => {
		if (!_.isArray(views)) views = [views];
		dispatch(actionAdd(views));
	};
}

function apiDeleteView(key, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiDeleteViewRequest(key));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/customview/delete');

		let query = queryString.stringify({id: key});
		url += '?' + query;

		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(
			response => {
				console.log('#### delete view response', response);
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data.status === 'Ok'){
							dispatch(actionApiDeleteViewReceive(data));
							dispatch(actionRemove([key]));
						} else {
							dispatch(actionApiDeleteViewRequestError('no data returned'));
						}
					});
				} else {
					dispatch(actionApiDeleteViewRequestError(response))
				}
			},
			error => {
				console.log('#### delete view error', error);
				if (ttl - 1) {
					dispatch(apiDeleteView(key, ttl - 1));
				} else {
					dispatch(actionApiDeleteViewRequestError("views#action delete view: View was not deleted!"));
				}
			}
		);
	};
}

function apiLoadViews(ttl) {
    if (_.isUndefined(ttl)) ttl = TTL;
    return dispatch => {
        dispatch(actionApiLoadViewsRequest());

        let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/dataview');

        return fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(
            response => {
                console.log('#### load views response', response);
                let contentType = response.headers.get('Content-type');
                if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
                    return response.json().then(data => {
                        Promise.all(data.data.map(dataView => {
                            return new Dataview({data: dataView}).then(dataView => {
                                dataView.key = dataView.id;
                                return dataView;
                            });
                        })).then(dataViews => {
                            dispatch(actionAdd(dataViews));
                        });
                    });
                } else {
                	dispatch(actionApiLoadViewsRequestError("views#action load views: It wasn't possible to load Views"));
                }
            },
            error => {
                console.log('#### load views error', error);
                if (ttl - 1) {
                    dispatch(apiLoadViews(ttl - 1));
                } else {
                    dispatch(actionApiLoadViewsRequestError("views#action load views: It wasn't possible to load Views "));
                }
            }
        );
    };
}

// ============ actions ===========

function actionAdd(views) {
	return {
		type: ActionTypes.VIEWS_ADD,
		data: views
	}
}

function actionRemove(keys) {
	return {
		type: ActionTypes.VIEWS_REMOVE,
		keys: keys
	}
}

function actionApiDeleteViewReceive(data) {
	return {
		type: ActionTypes.VIEWS_DELETE_RECEIVE,
		data: data
	}
}

function actionApiDeleteViewRequest(key) {
	return {
		type: ActionTypes.VIEWS_DELETE_REQUEST,
		key: key
	}
}

function actionApiLoadViewsRequest() {
    return {
        type: ActionTypes.VIEWS_LOAD_REQUEST
    }
}

function actionApiLoadViewsRequestError(error) {
	return {
		type: ActionTypes.VIEWS_LOAD_REQUEST_ERROR,
		error: error
	};
}

function actionApiDeleteViewRequestError(error) {
	return {
		type: ActionTypes.VIEWS_DELETE_REQUEST_ERROR,
		error: error
	}
}

// ============ export ===========

export default {
	add: add,
    apiLoadViews: apiLoadViews,
	apiDeleteView: apiDeleteView
}

import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import config from '../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import utils from '../../utils/utils';

// ============ creators ===========

function load() {
	return (dispatch, getState) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/lpis_cases');

		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			if (responseContent) {
				let lpisCases = responseContent['data']['lpis_cases'];
				let lpisCaseChanges = responseContent['data']['lpis_case_changes'];
				let places = responseContent['data']['places'];

				if(places && places.length) {
					let loadedPlaces = Select.places.getPlaces(getState());
					dispatch(actionAddLpisCasePlaces(_getMissingRecords(loadedPlaces, places)));
				}

				if(lpisCaseChanges && lpisCaseChanges.length) {
					let loadedLpisCaseChanges = Select.lpisCases.getChanges(getState());
					dispatch(actionAddLpisCaseChanges(_getMissingRecords(loadedLpisCaseChanges, lpisCaseChanges)));
				}

				if(lpisCases && lpisCases.length) {
					let loadedLpisCases = Select.lpisCases.getCases(getState());
					dispatch(actionAddLpisCases(_getMissingRecords(loadedLpisCases, lpisCases)));
				}
			}
		})
	}
}

function createLpisCase(data, files) {
	return (dispatch) => {
		console.log(`#### createLpisCase`, data, files);

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');

		let formData = new FormData();
		formData.append(`data`, JSON.stringify({lpis_cases: [{uuid: utils.guid(), data: data, status: "created"}]}));

		Object.keys(files).forEach((fileKey) => {
			formData.append(fileKey, files[fileKey]);
		});

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json'
			},
			body: formData
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {

		});
	};
}

function _getMissingRecords(existing, toAdd) {
	let missing = [];

	if (!_.isArray(toAdd)) toAdd = [toAdd];
	if (!_.isArray(existing)) existing = [existing];

	toAdd.forEach((toAddOne) => {
		if (!_.find(existing, {key: toAddOne.id})) {
			missing.push({key: toAddOne.id, data: toAddOne.data});
		}
	});

	return missing;
}

// ============ actions ===========

function actionAddLpisCases(lpisCases) {
	return {
		type: ActionTypes.LPIS_CASES_ADD,
		data: lpisCases
	}
}

function actionAddLpisCaseChanges(lpisCaseChanges) {
	return {
		type: ActionTypes.LPIS_CASE_CHANGES_ADD,
		data: lpisCaseChanges
	}
}

function actionAddLpisCasePlaces(places) {
	return {
		type: ActionTypes.PLACES_ADD,
		data: places
	}
}

function actionChangeSearchString(searchString) {
	return {
		type: ActionTypes.LPIS_CASES_SEARCH_STRING_CHANGE,
		searchString: searchString
	}
}

// ============ export ===========

export default {
	load: load,
	createLpisCase: createLpisCase,
	changeSearchString: actionChangeSearchString
}

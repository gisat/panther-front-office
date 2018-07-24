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
		console.log(`#### LpisCases/actions -> load()`);

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/lpis_cases');

		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(response => {
			if(response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			if(responseContent) {
				let lpisCases = responseContent['data']['lpis_cases'];
				let lpisCaseChanges = responseContent['data']['lpis_case_changes'];
				let places = responseContent['data']['places'];

				if(lpisCases && lpisCases.length) {
					let loadedLpisCases = Select.lpisCases.getCases(getState());
					dispatch(actionAddLpisCases(_getMissingRecords(loadedLpisCases, lpisCases)));
				}

				if(lpisCaseChanges && lpisCaseChanges.length) {
					let loadedLpisCaseChanges = Select.lpisCases.getChanges(getState());
					dispatch(actionAddLpisCaseChanges(_getMissingRecords(loadedLpisCaseChanges, lpisCaseChanges)));
				}

				if(places && places.length) {
					let loadedPlaces = Select.places.getPlaces(getState());
					dispatch(actionAddLpisCasePlaces(_getMissingRecords(loadedPlaces, places)));
				}
			}
		})
	}
}

function _getMissingRecords(existing, toAdd) {
	console.log(`#### 3`);
	let missing = [];

	if(!_.isArray(toAdd)) toAdd = [toAdd];
	if(!_.isArray(existing)) existing = [existing];

	toAdd.forEach((toAddOne) => {
		if(!_.find(existing, {key: toAddOne.id})) {
			missing.push({key: toAddOne.id, data: toAddOne.data});
		}
	});

	console.log(`#### 4`);
	return missing;
}

// ============ actions ===========

function actionAddLpisCases(lpisCases) {
	console.log(`#### 2`);
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

// ============ export ===========

export default {
	load: load
}

import path from "path";
import ActionTypes from '../../constants/ActionTypes';
import LpisChangeCasesActions from '../LpisChangeCases/actions';
import Select from '../Select';
import config from "../../../../config/index";

// ============ creators ===========

// ============ actions ===========
function createNewActiveEditedCase(key) {
	return {
		type: ActionTypes.LPIS_CHANGE_CASES_EDITED.CREATE_NEW_ACTIVE_EDITED_CASE,
		key: key
	}
}

function createLpisCase() {
	return (dispatch, getState) => {
		const state = getState();
		const url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/specific');
		const activeNewEditedCase = Select.specific.lpisChangeCasesEdited.getActiveEditedCase(state);

		const formData = new FormData();

		const data = {
			key: activeNewEditedCase.key,
			data: activeNewEditedCase.data,
			attachments: []
		};

		delete data.data.attachment;
		data.data.status = 'created';

		Object.keys(activeNewEditedCase.files).forEach((fileKey) => {
			const isGeometryBefore = activeNewEditedCase.data.geometryBefore && activeNewEditedCase.data.geometryBefore.identifiers[0] === fileKey;
			const isGeometryAfter = activeNewEditedCase.data.geometryAfter && activeNewEditedCase.data.geometryAfter.identifiers[0] === fileKey;
			const geometryType = isGeometryBefore ? 'geometryBefore' : isGeometryAfter ? 'geometryAfter' : null;
			const file = activeNewEditedCase.files[fileKey];
			if(geometryType) {
				data.data[geometryType] = `${'attachment'}:${fileKey}`;
				formData.append(fileKey, file);
			} else {
				//if file is not geometry and should be saved
				data.attachments.push(fileKey);
				formData.append(fileKey, file);
			}
		});

		formData.append(
			`data`,
			JSON.stringify(
				{
					lpisChangeCases: [data]
				}
			)
		);

		return fetch(url, {
			method: 'POST',
			// credentials: 'include',
			headers: {
				'Accept': 'application/json',
				// 'Content-Type': 'application/json'
			},
			body: formData
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			//TODO - not sure by this solution
			//clear index for LpisChangeCases
			dispatch(LpisChangeCasesActions.clearIndex(null, [['submitDate', 'descending']]))
		});
	};
}

function editActiveEditedCase(column, value, files) {
	return {
		type: ActionTypes.LPIS_CHANGE_CASES_EDITED.EDIT_ACTIVE_EDITED_CASE,
		column: column,
		value: value,
		files
	}
}

function actionClearEditedCase(key) {
	return {
		type: ActionTypes.LPIS_CHANGE_CASES_EDITED.CLEAR_EDITED_CASE,
		key
	}
}

function clearActiveEditedCase() {
	return (dispacth, getState) => {
		let state = getState();
		let activeEditedCaseKey = Select.specific.lpisChangeCasesEdited.getActiveEditedCaseKey(state);
		dispacth(actionClearEditedCase(activeEditedCaseKey));
	}
}


// ============ export ===========

export default {
	createNewActiveEditedCase,
	createLpisCase,
	editActiveEditedCase,
	clearActiveEditedCase,
}
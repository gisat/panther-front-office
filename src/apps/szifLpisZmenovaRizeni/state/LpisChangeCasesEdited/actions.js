import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

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
		// const url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata');
		const url = 'http://192.168.2.206:8963/backend/rest/specific'
		const activeNewEditedCase = Select.specific.lpisChangeCasesEdited.getActiveEditedCase(state);

		const formData = new FormData();

		const data = {
			key: activeNewEditedCase.key,
			status: 'created',
			data: activeNewEditedCase.data,
		};

		Object.keys(activeNewEditedCase.files).forEach((fileKey) => {
			const isGeometryBefore = activeNewEditedCase.data.geometryBefore && activeNewEditedCase.data.geometryBefore.identifier === fileKey;
			const isGeometryAfter = activeNewEditedCase.data.geometryAfter && activeNewEditedCase.data.geometryAfter.identifier === fileKey;
			const geometryType = isGeometryBefore ? 'geometryBefore' : isGeometryAfter ? 'geometryAfter' : null;
			if(geometryType) {
				const file = activeNewEditedCase.files[fileKey];
				data.data[geometryType] = `${'attachement'}:${file.name}`;
				formData.append(`attachements`,file);
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
			// dispatch(actionAdd)
			// dispatch(_storeResponseContent(responseContent));
		});
	};
}

function editActiveEditedCase(column, value, file) {
	return {
		type: ActionTypes.LPIS_CHANGE_CASES_EDITED.EDIT_ACTIVE_EDITED_CASE,
		column: column,
		value: value,
		file: file
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
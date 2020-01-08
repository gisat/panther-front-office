import fetch from 'isomorphic-fetch';
import config from '../../../../../config/index';
import download from 'downloadjs';
import Select from '../../../state/Select';

function error (message) {
	throw new Error(message);
}

export default (type, applyFilter) => {
	return (dispatch, getState) => {
		const state = getState();

		const applicationKey = Select.app.getKey(state);
		const scopeKey = Select.scopes.getActiveKey(state);
		const attributeKey = Select.attributes.getActiveKey(state);
		const periodKeys = Select.periods.getActiveKeys(state);
		const selection = Select.specific.esponFuoreSelections.getActiveWithFilteredKeys(state);

		const filter = {
			applicationKey,
			scopeKey,
			attributeKey,
			periodKey: {
				in: periodKeys
			}
		};

		/* Endpoint */
		let url = `${config.apiBackendProtocol}://${config.apiBackendHost}/backend/rest/export/${type ? type : 'geojson'}/filtered`;

		/* Payload */
		let payload = {
			filter,
			snapToGrid: 0.1
		};

		let filteredFeatures = null;
		if (selection && applyFilter) {
			filteredFeatures = selection.data && selection.data.filteredKeys;
		}

		if (filteredFeatures) {
			payload.features = filteredFeatures;
		}

		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: payload ? JSON.stringify(payload) : null
		}).then(
			response => {
				if (response && response.ok) {
					if (!type || type === 'geojson') {
						return response.json().then((data) => {
							if (data && !data.error) {
								download(JSON.stringify(data), 'data.geojson', 'text/plain');
							} else {
								error("No data exported! " + data.error);
							}
						}).catch(err => {
							error("Export failed: " + err);
						});
					} else if (type === 'shp') {
						return response.blob().then((data) => {
							if (data) {
								download(data, "data.zip");
							} else {
								error("No data exported! " + data.error);
							}
						}).catch(err => {
							error("Export failed: " + err);
						});
					} else {
						error(`Format ${type} is not supported!`);
					}
				} else {
					error("Export failed: " + response.statusText);
				}
			},
			err => {
				error(err);
			}
		).catch(err => {
			return error(err);
		});
	};
}
import fetch from 'isomorphic-fetch';
import config from '../../../../../config/index';
import download from 'downloadjs';
import Select from '../../../state/Select';

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
		let url = `${config.serverUrl}rest/export/${type ? type : 'geojson'}/filtered`;

		/* Payload */
		let payload = {filter};

		let filteredFeatures = null;
		if (selection && applyFilter) {
			filteredFeatures = selection.data && selection.data.filteredKeys;
		}

		if (filteredFeatures) {
			payload.features = filteredFeatures;
		}

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: payload ? JSON.stringify(payload) : null
		}).then(
			response => {
				if (response) {
					response.json().then((data) => {
						if (data) {
							download(JSON.stringify(data), 'data.geojson', 'text/plain');
						} else {
							throw new Error("No data exported");
						}
					}).catch(error => {
						throw new Error("Export failed: " + error);
					});
				}
			},
			error => {
				throw new Error("Export failed: " + error);
			}
		);
	};
}
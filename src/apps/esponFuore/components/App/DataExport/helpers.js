import fetch from 'isomorphic-fetch';
import config from '../../../../../config/index';
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

		let payload = {
			filter,
			type
		};

		let filteredFeatures = null;
		if (selection && applyFilter) {
			filteredFeatures = selection.data && selection.data.filteredKeys;
		}

		if (filteredFeatures) {
			payload.features = filteredFeatures;
		}

		// TODO add path to endpoint
		fetch(config.serverUrl + "path", {
			method: 'POST',
			body: payload ? JSON.stringify(payload) : null
		}).then(
			response => {
				// TODO handle response
			},
			error => {
				throw new Error("Export failed: " + error)
			}
		);
	};
}
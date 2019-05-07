import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

// TODO cleanup initial state
const INITIAL_STATE = {
	charts: {
		fuoreTestChart: {
			key: "fuoreTestChart",
			data: {
				// type: "",
				name: "Test chart",
				layerTemplate: "d4cc6d2a-390d-4ca0-bec8-be078bb47720",
				// atrributes: []
				// periods: [],
				// scope: ""
			}
		},
		fuoreTestAllPeriods: {
			key: "fuoreTestAllPeriods",
			data: {
				// type: "",
				name: "Test chart",
				layerTemplate: "d4cc6d2a-390d-4ca0-bec8-be078bb47720",
				// atrributes: []
				periods: ["14d84116-327c-48f8-ae24-293f188b7a35", "00b8b853-8c43-408c-90e5-99a042f78575", "7d747b48-2b62-4aa0-aa0f-232e5a44a517", "d868dbaf-43a4-43c6-821e-c08bd7c9cd2f", "d90f56b7-aa70-4faf-8dc8-fc90001b9070"],
				// scope: ""
			}
		}
	},
	sets: {
		esponFuoreCharts: {
			key: "esponFuoreCharts",
			charts: ["testChart", "fuoreTestAllPeriods"]
		}
	}
};

function update(state, action) {
	return {...state, ...action.data};
}


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.CHARTS.UPDATE:
			return update(state, action);
		default:
			return state;
	}
}

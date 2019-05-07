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
		}
	},
	sets: {
		esponFuoreCharts: {
			key: "esponFuoreCharts",
			charts: ["testChart"]
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

import _ from 'lodash';

export default {
	add: (state, action) => {
		let data;
		if (state.data && state.data.length) {
			// remove old versions of received models
			let oldData = _.reject(state.data, model => {
				return _.find(action.data, {key: model.key});
			});
			data = [...oldData, ...action.data];
		} else {
			data = [...action.data];
		}
		return {...state, loading: false, data: data};
	},

	addByKey: (state, action) => {
		let newData = {...state.byKey};
		if (action.data && action.data.length) {
			action.data.forEach(model => {
				newData[model.key] = {...newData[model.key], ...model};
			});
		}
		return {...state, byKey: newData}
	}
}

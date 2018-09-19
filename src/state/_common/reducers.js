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

	// TODO add not-existing models only or remove old versions of existing models and replace them with new ones?
	// TODO methods are identical
	addByKey: (state, action) => {
		let newData = {};
		if (action.data && action.data.length){
			action.data.forEach(model => {
				newData[model.key] = model;
			});
		}
		return {...state, byKey: (state.byKey ? {...state.byKey, ...newData} : {...newData})}
	},

	updateByKey: (state, action) => {
		let updatedData = {};
		if (action.data && action.data.length){
			action.data.forEach(model => {
				updatedData[model.key] = model;
			});
		}
		return {...state, byKey: (state.byKey ? {...state.byKey, ...updatedData} : {...updatedData})}
	}
}

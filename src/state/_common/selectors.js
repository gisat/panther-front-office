export default {
	getActiveKey: (getSubstate) => {
		return (state) => getSubstate(state).activeKey
	},
	getAll: (getSubstate) => {
		return (state) => {
			let data = getSubstate(state).byKey;
			return data ? Object.values(data) : null;
		}
	}
}
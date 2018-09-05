export default {
	getActiveKey: (getSubstate) => {
		return (state) => getSubstate(state).activeKey
	}
}
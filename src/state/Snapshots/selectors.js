import common from '../_common/selectors';

const getSubstate = state => state.snapshots;

const getAll = common.getAll(getSubstate);

export default {
	getAll
}
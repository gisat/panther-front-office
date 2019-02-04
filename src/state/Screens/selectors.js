import common from '../_common/selectors';

const getSubstate = state => state.screens;

const getAll = common.getAll(getSubstate);

export default {
	getAll
}
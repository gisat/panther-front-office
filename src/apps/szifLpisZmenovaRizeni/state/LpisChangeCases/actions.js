import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../../../../state/_common/actions';

// ============ creators ===========

const useIndexedClear = common.useIndexedClear(ActionTypes.LPIS_CHANGE_CASES);
const useIndexed = common.useIndexed(Select.specific.lpisChangeCases.getSubstate, 'lpisChangeCases', ActionTypes.LPIS_CHANGE_CASES, 'specific');

// ============ actions ===========

// ============ export ===========

export default {
	useIndexed,
	useIndexedClear,
}
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';


import common from "../_common/actions";

const useIndexed = common.useIndexed(Select.spatialData.getSubstate, 'spatial', ActionTypes.SPATIAL_DATA, 'data');

// ============ creators ===========

// ============ export ===========

export default {
	useIndexed
}

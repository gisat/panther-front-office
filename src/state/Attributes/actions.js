import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const useKeys = common.useKeys(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);

// ============ export ===========

export default {
	useKeys
}

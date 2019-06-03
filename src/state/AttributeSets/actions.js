import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import AttributesActions from '../Attributes/actions';

import _ from 'lodash';
import common from "../_common/actions";


// ============ creators ===========

const setActiveKeys = common.setActiveKeys(ActionTypes.ATTRIBUTE_SETS);

// ============ export ===========

export default {
	setActiveKeys
}

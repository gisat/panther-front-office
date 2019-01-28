import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";


// ============ creators ===========
const loadFilteredByTemplateKeys = (keys) => {
	let filter = {
		layerTemplateKey: {
			in: keys
		}
	};

	return common.loadFiltered('spatial', ActionTypes.SPATIAL_RELATIONS, filter, 'relations');
};

// ============ actions ===========


// ============ export ===========

export default {
	loadFilteredByTemplateKeys
}

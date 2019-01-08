import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import common from "../_common/actions";
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.WMS_LAYERS);

function loadFilteredFromOldEndpoint(filter){
	return (dispatch) => {
		dispatch(common.request('backend/rest/wms/layer', "GET", filter, null, loadFilteredReceive, () => {}));
	};
}

function loadFilteredReceive(data) {
	return (dispatch) => {
		if (data && data.length){
			let adjustedData = data.map(wmsLayer => {
				return {
					key: wmsLayer.id,
					data: wmsLayer
				}
			});
			dispatch(add(adjustedData));
		}
	};
}

// ============ export ===========

export default {
	add,
	loadFilteredFromOldEndpoint
}

import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import vectorActions from './vector/actions';
import common from "../_common/actions";

// ============ creators ===========
const ensureKeys = (keys) => {
	return common.ensure(Select.spatialDataSources.getSubstate, 'dataSources', ActionTypes.SPATIAL_DATA_SOURCES, keys,'dataSources');
};

// ============ export ===========

export default {
	ensureKeys,
	vector: vectorActions
}

import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';
import common from "../_common/selectors";

const getSubstate = state => state.dataviews;

const getAll = common.getAll(getSubstate);
const getAllForActiveScope = common.getAllForActiveScope(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getByKey = common.getByKey(getSubstate);


const getViewsForScope = createSelector(
	getAll,
	(state, scope) => scope,
	(views, scope) => {
		if (!scope) {
			return null;
		} else {
			return _.filter(views, (view) => {
				return (view.data && view.data.dataset) === scope.key
			});
		}
	}
);

const isActiveUnreceived = createSelector(
	[getActive],
	(active) => {
		return active && active.unreceived;
	}
);

export default {
	getSubstate,
	getView: getByKey,
	getViews: getAll,
	getActive,
	getActiveKey,
	getAllForActiveScope,
	getViewsForScope,
	isActiveUnreceived
};
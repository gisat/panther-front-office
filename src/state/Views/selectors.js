import {createSelector} from 'reselect';
import _ from 'lodash';

const getViews = state => state.views.data;
const getActiveKey = state => state.views.activeKey;

const getViewsForScope = createSelector(
	[getViews, (state, scope) => (scope)],
	(views, scope) => {
		if (!scope){
			return [];
		} else {
			return _.filter(views, (view) => {return view.data.dataset === scope.key});
		}
	}
);

export default {
	getViewsForScope: getViewsForScope,
	getViews: getViews,
	getActiveKey: getActiveKey
};
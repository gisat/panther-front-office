import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../../../Select';

const getIntro = (state) => state.components.overlays.views.intro;
const getSelectedScope = (state) => state.components.overlays.views.selectedScope;

const getIntroTitle = createSelector(
	[getIntro],
	(intro) => {
		return intro ? intro.title : "";
	}
);

const getIntroText = createSelector(
	[getIntro],
	(intro) => {
		return intro ? intro.text : "";
	}
);

const getIntroLogo = createSelector(
	[getIntro],
	(intro) => {
		return intro ? intro.logo : false;
	}
);

const getSelectedScopeData = createSelector(
	[getSelectedScope, (state) => Select.scopes.getScopes(state)],
	(selectedScopeKey, scopes) => {
		return _.find(scopes, function(scope){
			return scope.key === selectedScopeKey;
		});
	}
);

export default {
	getIntro: getIntro,
	getIntroLogo: getIntroLogo,
	getIntroTitle: getIntroTitle,
	getIntroText: getIntroText,
	getSelectedScopeData: getSelectedScopeData
};
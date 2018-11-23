import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";


// TODO is this correct approach?

const mapStateToPropsFactory = () => {
	const componentId = 'ThemeSelector_' + utils.randomString(6);

	return state => {
		return {
			componentId: componentId,
			isInIntroMode: Select.components.isAppInIntroMode(state),
			activeTheme: Select.themes.getActive(state),
			themes: Select.themes.getAllForIndexInUseByComponentId(state, componentId),
			scopeKey: Select.scopes.getActiveScopeKey(state)
		}
	}
};

const mapDispatchToPropsFactory = () => {
	return (dispatch) => {
		return {
			onChangeTheme: (key) => {
				dispatch(Action.themes.setActive(key));
			},
			onScopeChange: (key, componentId) => {
				dispatch(Action.themes.useIndexed({dataset: key}, [['name', 'ascending']], 1, 1000, componentId));
			}
		}
	}
};

export default connect(mapStateToPropsFactory, mapDispatchToPropsFactory)(presentation);
import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";

const order = [['name', 'ascending']];

const mapStateToProps = (state) => {
	return {
		isInIntroMode: Select.components.isAppInIntroMode(state),
		activeTheme: Select.themes.getActive(state),
		themes: Select.themes.getAllForActiveScope(state, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ThemeSelector_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onChangeTheme: (key) => {
				dispatch(Action.themes.setActive(key, componentId));
			},
			onMount: () => {
				dispatch(Action.themes.useIndexed({scope: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.themes.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
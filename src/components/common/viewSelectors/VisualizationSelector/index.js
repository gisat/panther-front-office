import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";

const order = [['name', 'ascending']];

const mapStateToProps = (state) => {
	let visualizations = Select.visualizations.getAllForActiveTheme(state, order);
	if(visualizations && visualizations.length > 0) {
		visualizations = visualizations.filter(visualization => visualization);
	}

	return {
		forceShow: Select.users.isAdminOrAdminGroupMember(state),
		isInIntroMode: Select.components.isAppInIntroMode(state),
		activeVisualization: Select.visualizations.getActive(state),
		visualizations: visualizations
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'VisualizationSelector_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onChangeVisualization: (key) => {
				dispatch(Action.visualizations.setActiveKey(key));
			},
			onMount: () => {
				dispatch(Action.visualizations.useIndexed({theme: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.visualizations.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
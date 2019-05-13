import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import utils from '../../../../../utils/utils';

import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeFilter: Select.selections.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_AreasFilter_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onClear: () => {
				dispatch(Action.selections.clearActiveSelection());
			},
			onSelect: (name, values, areas) => {
				dispatch(Action.selections.updateActiveSelection(name, values, areas));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import utils from '../../../../../utils/utils';

import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_AreasFilter_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onClear: () => {
				dispatch(Action.selections.clearActiveSelection());
			},
			onSelect: (name, areas) => {
				dispatch(Action.selections.updateActiveSelection(name, areas));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
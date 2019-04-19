import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import Button from '../../../../../../../components/common/atoms/Button'

import presentation from "./ToolItem";

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: Select.windows.isOpen(state, ownProps.itemKey)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		closeWindow: () => {
			dispatch(Action.windows.remove(ownProps.windowSetKey, ownProps.itemKey));
		},
		openWindow: () => {
			dispatch(Action.windows.addOrOpen(
				ownProps.windowSetKey,
				ownProps.itemKey,
				{
					title: 'Areas',
					icon: 'map-pin'
				},
				Button,
				null)
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
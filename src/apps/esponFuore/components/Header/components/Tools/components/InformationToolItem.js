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
			dispatch(Action.windows.remove(ownProps.windowsSetKey, ownProps.itemKey));
		},
		openWindow: () => {
			dispatch(Action.windows.addOrOpen(
				ownProps.windowsSetKey,
				ownProps.itemKey,
				{
					title: 'Information'
				},
				Button,
				null)
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
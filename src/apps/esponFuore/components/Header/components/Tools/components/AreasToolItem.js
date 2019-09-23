import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import presentation from "./ToolItem";
import AreasFilter from "../../../../App/AreasFilter";

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
					title: ownProps.name,
					icon: ownProps.icon,
					width: 350,
					maxWidth: 600,
					minHeight: 100,
					height: 350
				},
				(
					<AreasFilter/>
				))
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
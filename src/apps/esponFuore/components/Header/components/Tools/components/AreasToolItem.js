import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import presentation from "./ToolItem";
import AreasFilter from "../../../../App/AreasFilter";

const mapStateToProps = (state, ownProps) => {
	let indicatorSelect = Select.components.getDataByComponentKey(state, "esponFuore_IndicatorSelect");

	return {
		isOpen: Select.windows.isOpen(state, ownProps.itemKey),
		disabled: !indicatorSelect || (indicatorSelect && indicatorSelect.indicatorSelectOpen)
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
					width: 370,
					maxWidth: 600,
					minWidth: 300,
					minHeight: 150,
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
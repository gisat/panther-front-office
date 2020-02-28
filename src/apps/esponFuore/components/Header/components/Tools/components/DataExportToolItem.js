import {connect} from '@gisatcz/ptr-state';
import React from 'react';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import presentation from "./ToolItem";
import DataExport from "../../../../App/DataExport";

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
					width: 300,
					maxWidth: 400,
					minWidth: 200,
					minHeight: 200,
					height: 320
				},
				(
					<DataExport/>
				))
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
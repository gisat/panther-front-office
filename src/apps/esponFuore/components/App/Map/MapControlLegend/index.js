import { connect } from 'react-redux';
import {Action, Select} from '@gisatcz/ptr-state';
import React from "react";

import presentation from './presentation';

import MapLegend from '../MapLegend';

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
					title: 'Legend',
					icon: 'legend',
					width: 350,
					maxWidth: 600,
					height: 330,
					position: {
						bottom: 55,
						left: 25
					}
				},
				(
					<MapLegend 
						mapSetKey = {ownProps.mapSetKey}
						showNoData = {true}
					/>
				))
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);

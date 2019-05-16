import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import React from "react";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	// const activeMapKey = Select.maps.getActiveMapKey(state);
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
					icon: 'plus-thick',
					width: 300,
					height: 300
				},
				(
					<div>
						legenda
					</div>
				))
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);

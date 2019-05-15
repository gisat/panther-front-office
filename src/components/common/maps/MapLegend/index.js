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
					title: 'Legenda',
					icon: 'plus-thick',
					width: 400,
					maxWidth: 600,
					height: 500
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

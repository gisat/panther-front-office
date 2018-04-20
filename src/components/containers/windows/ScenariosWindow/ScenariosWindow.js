import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import PantherWindow from "../../../presentation/windows/PantherWindow/PantherWindow";

class ScenariosWindow extends React.PureComponent {

	constructor(props){
		super();
	}

	render() {
		let window =  React.createElement(PantherWindow, {
			name: "Scenarios",
			id: "scenarios-window",
			open: this.props.open,
			onClose: this.props.onClose.bind(this)
		});

		return (
			<div>
				{window}
			</div>
		);
	}

}

export default ScenariosWindow;

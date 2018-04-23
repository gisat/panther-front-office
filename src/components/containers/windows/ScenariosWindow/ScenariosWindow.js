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
		let props = {
			name: "Scenarios",
			id: "scenarios-window"
		};
		let window =  React.createElement(PantherWindow, {...props, ...this.props});

		return (
			<div className="ptr-window-container">
				{window}
			</div>
		);
	}

}

export default ScenariosWindow;

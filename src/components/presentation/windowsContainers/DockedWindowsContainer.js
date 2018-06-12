import React from 'react';
import PropTypes from 'prop-types';
import ScenariosWindow from '../../../scopemagicswitches/ScenariosWindow';

import './DockedWindowsContainer.css'

class WindowsContainer extends React.PureComponent {
	render() {
		let windows = [];

		if (this.props.scenariosWindowDocked){
			windows.push(<ScenariosWindow key='scenario-window'/>);
		}

		return (
			<div className="docked-windows-container">
				{windows}
			</div>
		);
	}

}

export default WindowsContainer;

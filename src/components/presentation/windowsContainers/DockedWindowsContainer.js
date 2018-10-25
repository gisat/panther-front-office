import React from 'react';
import PropTypes from 'prop-types';
import ScenariosWindow from '../../../scopemagicswitches/ScenariosWindow';
import SnapshotsWindow from "../windows/SnapshotsWindow/SnapshotsWindow";
import ViewsWindow from '../../containers/windows/ViewsWindow/ViewsWindow';

import './DockedWindowsContainer.css'
import Window from "../../containers/Window";

class WindowsContainer extends React.PureComponent {
	render() {
		let windows = [];

		if (this.props.scenariosWindowDocked){
			windows.push(<ScenariosWindow key='scenario-window'/>);
		}
		if (this.props.snapshotsWindowDocked){
			windows.push(<SnapshotsWindow key='snapshots-window'/>);
		}
		if (this.props.viewsWindowDocked){
			windows.push(<ViewsWindow key='views-window'/>);
		}

		return (
			<div className="docked-windows-container">
				{windows}
			</div>
		);
	}

}

export default WindowsContainer;

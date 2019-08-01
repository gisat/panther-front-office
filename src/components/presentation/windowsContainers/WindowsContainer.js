import React from 'react';
import PropTypes from 'prop-types';
import ScenariosWindow from '../../../scopemagicswitches/ScenariosWindow';
import ViewsWindow from '../../containers/windows/ViewsWindow/ViewsWindow';
import ShareWindow from '../../containers/windows/ShareWindow/ShareWindow';

import './WindowsContainer.css'
import Window from "../../containers/Window";
import SnapshotsWindow from "../../containers/windows/SnapshotsWindow/SnapshotsWindow";

class WindowsContainer extends React.PureComponent {
	render() {
		let windows = [];

		if (!this.props.scenariosWindowDocked){
			windows.push(<ScenariosWindow key='scenario-window'/>);
		}
		if (!this.props.snapshotsWindowDocked){
			windows.push(<SnapshotsWindow key='snapshots-window'/>)
		}
		if (!this.props.viewsWindowDocked){
			windows.push(<ViewsWindow key='views-window'/>);
		}
		if (!this.props.shareWindowDocked && this.props.shareWindowVisible){
			windows.push(<ShareWindow key='share-window'/>);
		}

		return (
			<div className="windows-container">
				{windows}
			</div>
		);
	}

}

export default WindowsContainer;
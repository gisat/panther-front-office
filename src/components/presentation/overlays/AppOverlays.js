import React from 'react';
import PropTypes from 'prop-types';
import DataUploadOverlay from '../../containers/overlays/DataUploadOverlay';
import MapEditingOverlay from '../../../scopemagicswitches/MapEditingOverlay';

class AppOverlays extends React.PureComponent {
	render() {
		return (
			<div className="app-overlays">
				<DataUploadOverlay />
				<MapEditingOverlay />
			</div>
		);
	}

}

export default AppOverlays;

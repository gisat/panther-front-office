import React from 'react';
import PropTypes from 'prop-types';
import ViewsOverlay from '../../containers/overlays/ViewsOverlay';
import DataUploadOverlay from '../../containers/overlays/DataUploadOverlay';
import MapEditingOverlay from '../../../scopemagicswitches/MapEditingOverlay';

class AppOverlays extends React.PureComponent {
	render() {
		return (
			<div className="app-overlays">
				<DataUploadOverlay />
				<MapEditingOverlay/>
				<ViewsOverlay/>
			</div>
		);
	}

}

export default AppOverlays;

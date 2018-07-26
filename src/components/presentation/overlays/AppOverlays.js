import React from 'react';
import PropTypes from 'prop-types';
import ViewsOverlay from '../../containers/overlays/ViewsOverlay';
import DataUploadOverlay from '../../containers/overlays/DataUploadOverlay';
import MapEditingOverlay from '../../../scopemagicswitches/MapEditingOverlay';
import OverlayHeader from '../../../scopemagicswitches/OverlayHeader';

class AppOverlays extends React.PureComponent {
	render() {
		return (
			<div className="app-overlays">
				<OverlayHeader />
				<DataUploadOverlay />
				<MapEditingOverlay/>
				<ViewsOverlay/>
			</div>
		);
	}

}

export default AppOverlays;

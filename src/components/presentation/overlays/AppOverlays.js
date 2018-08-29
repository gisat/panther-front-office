import React from 'react';
import PropTypes from 'prop-types';
import ViewsOverlay from '../../containers/overlays/ViewsOverlay';
import DataUploadOverlay from '../../containers/overlays/DataUploadOverlay';
import MapEditingOverlay from '../../../scopemagicswitches/MapEditingOverlay';
import OverlayHeader from '../../../scopemagicswitches/OverlayHeader';
import LoginOverlay from '../../common/overlays/LoginOverlay';

class AppOverlays extends React.PureComponent {
	render() {
		return (
			<div className="app-overlays">
				<OverlayHeader />
				<DataUploadOverlay />
				<MapEditingOverlay/>
				<ViewsOverlay/>
				<LoginOverlay />
			</div>
		);
	}

}

export default AppOverlays;

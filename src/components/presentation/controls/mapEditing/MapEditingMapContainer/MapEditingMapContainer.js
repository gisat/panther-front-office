import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import MapEditingWorldWindMap from '../../../maps/MapEditingWorldWindMap/MapEditingWorldWindMap'

import './MapEditingMapContainer.css';

class MapEditingMapContainer extends React.PureComponent {

	static propTypes = {
		activeBackgroundLayerKey: PropTypes.string,
		place: PropTypes.object
	};

	constructor(props){
		super(props);
	}

	render() {
		let mapContainerClass = "ptr-overlay-editing-map-container";
		let bbox = this.props.place && this.props.place.bbox ? this.props.place.bbox : null;

		return (
			<div className={mapContainerClass}>
				<MapEditingWorldWindMap
					activeBackgroundLayerKey={this.props.activeBackgroundLayerKey}
					bbox={bbox}
					mapContainerClass={mapContainerClass}
				/>
			</div>
		);
	}
}

export default MapEditingMapContainer;

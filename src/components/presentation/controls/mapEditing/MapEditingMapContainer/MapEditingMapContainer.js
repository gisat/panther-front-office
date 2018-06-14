import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import MapEditingWorldWind from '../../../maps/MapEditingWorldWind/MapEditingWorldWind'

import './MapEditingMapContainer.css';

class MapEditingMapContainer extends React.PureComponent {

	static propTypes = {
	};

	constructor(props){
		super(props);
	}

	render() {
		let mapContainerClass = "ptr-overlay-editing-map-container";

		return (
			<div className={mapContainerClass}>
				<MapEditingWorldWind
					activeBackgroundLayerKey={this.props.activeBackgroundLayerKey}
					mapContainerClass={mapContainerClass}
				/>
			</div>
		);
	}
}

export default MapEditingMapContainer;

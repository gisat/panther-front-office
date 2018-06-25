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
	};

	constructor(props){
		super(props);
	}

	render() {
		let mapContainerClass = "ptr-editing-map-container";

		return (
			<div className={mapContainerClass}>
				<MapEditingWorldWindMap
					activeBackgroundLayerKey={this.props.activeBackgroundLayerKey}
					mapContainerClass={mapContainerClass}
					navigatorState={this.props.navigatorState}
				/>
			</div>
		);
	}
}

export default MapEditingMapContainer;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import WorldWindMap from "../WorldWindMap";

import './style.css';

class MapSet extends React.PureComponent {

	static propTypes = {
		mapSetKey: PropTypes.string,
		maps: PropTypes.array
	};

	render() {
		return (
			<div className="ptr-map-set">
				{this.renderMaps()}
			</div>
		);
	}

	renderMaps() {
		if (this.props.maps && this.props.maps.length) {
			return this.props.maps.map(mapKey => {
				return <WorldWindMap
					key={mapKey}
					mapKey={mapKey}
					elevationModel={null}
					delayedWorldWindNavigatorSync={null} // miliseconds to wait until synchronize navigator change with store
				/>
			});
		} else {
			return null;
		}
	}
}

export default MapSet;

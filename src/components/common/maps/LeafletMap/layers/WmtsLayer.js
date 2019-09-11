import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

class WmtsLayer extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		group: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.layer = L.tileLayer(props.data.options.url);
		props.group.addLayer(this.layer);
	}

	render() {
		return null;
	}
}

export default WmtsLayer;

import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

class WmsLayer extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		map: PropTypes.object
	};

	constructor(props) {
		super(props);

		// todo add other params
		this.layer = L.tileLayer.wms(props.data.options.url, {
			layers: props.data.options.params.layers,
			format: props.data.options.params.imageFormat || 'image/png',
			transparent: true,
			opacity: props.data.opacity || 1,
			styles: props.data.options.params.styles
		});

		this.layer.addTo(props.map);
	}

	render() {
		return null;
	}
}

export default WmsLayer;

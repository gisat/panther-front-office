import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

class WmsLayer extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		group: PropTypes.object,
		zIndex: PropTypes.number
	};

	constructor(props) {
		super(props);

		let data = {
			layers: props.data.options.params.layers,
			format: props.data.options.params.imageFormat || 'image/png',
			transparent: true,
			opacity: props.data.opacity || 1,
			zIndex: this.props.zIndex
		};

		if (props.data.options.params.styles) {
			data.styles = props.data.options.params.styles;
		}

		// todo add other params
		this.layer = L.tileLayer.wms(props.data.options.url, data);

		props.group.addLayer(this.layer);
	}

	render() {
		return null;
	}
}

export default WmsLayer;

import React from 'react';
import PropTypes from 'prop-types';
class MapTimelineLegand extends React.PureComponent {
	static propTypes = {
		layers: PropTypes.array,					//which layers display in timeline
	};

	static defaultProps = {
		layers: []
	}

	render() {
		const {layers} = this.props;
		const layersElms = layers.map(layer => {
			return <span key={layer.layerTemplateKey} className={'ptr-maptimeline-legenditem'} title={`${layer.title} ${layer.info}`}>{layer.title}</span>
		})
		return (
			<div className={'ptr-maptimelinelegend'}>
                {layersElms}
			</div>
		);

	}

}

export default MapTimelineLegand;

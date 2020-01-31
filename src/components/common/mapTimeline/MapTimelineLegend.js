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

		layers.sort((a, b) => a.zIndex-b.zIndex);

		//merge layers on same level
		let lastZIndex = -1;
		const layersElms = layers.reduce((acc, layer) => {
			if (lastZIndex < layer.zIndex) {
				lastZIndex = layer.zIndex;
				// return [...acc, <span key={layer.layerTemplateKey} className={'ptr-maptimeline-legenditem'} title={`${layer.title} ${layer.info}`}>{layer.title}</span>];
				//version without info
				return [...acc, <span key={layer.layerTemplateKey} className={'ptr-maptimeline-legenditem'} title={`${layer.title}`}>{layer.title}</span>];
			} else {
				return acc;
			}
		}, [])
		return (
			<div className={'ptr-maptimelinelegend'}>
                {layersElms}
			</div>
		);

	}

}

export default MapTimelineLegand;

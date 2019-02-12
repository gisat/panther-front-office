import React from 'react';
import PropTypes from "prop-types";

class LayerTemplateMetadataConfig extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
		layerTemplateKey: PropTypes.string,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func
	};

	componentDidMount(){
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		return (
			<div>
				Name: {this.props.data && this.props.data.nameDisplay}<br/>
				Name inernal: {this.props.data && this.props.data.nameInternal}
			</div>
		);
	}
}

export default LayerTemplateMetadataConfig;
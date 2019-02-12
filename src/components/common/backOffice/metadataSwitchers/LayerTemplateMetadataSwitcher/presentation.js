import React from 'react';
import PropTypes from "prop-types";

class LayerTemplateMetadataSwitcher extends React.PureComponent {
	static propTypes = {
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
				{"Layer Template: " + this.props.layerTemplateKey}
			</div>
		);
	}
}

export default LayerTemplateMetadataSwitcher;
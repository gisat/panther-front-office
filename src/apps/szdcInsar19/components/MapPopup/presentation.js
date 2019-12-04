import React from 'react';
import _ from 'lodash';

class MapPopup extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.onMount) {
			this.props.onMount();
		}
	}

	componentWillUnmount() {
		if (this.props.onUnmount) {
			this.props.onUnmount();
		}
	}

	render() {
		return (
			<div className="szdcInsar19-map-popup">
				<div>Point: {this.props.featureKey}</div>
				{this.props.attributesData && this.props.attributesMetadata ? this.renderContent() : null}
			</div>
		);
	}

	renderContent() {
		let content = [];
		_.forIn(this.props.attributesData, (value, attributeKey) => {
			let attributeMetadata = _.find(this.props.attributesMetadata, {key: attributeKey});
			content.push(
				<div>{attributeMetadata ? attributeMetadata.data.nameDisplay : attributeKey}: {value}</div>
			);
		});

		return (
			<>
				{content}
			</>
		);
	}
}

export default MapPopup;
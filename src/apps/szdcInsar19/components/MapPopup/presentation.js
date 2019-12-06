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
			this.props.featureKeys ? (
				<div className="szdcInsar19-map-popup">
					{this.props.featureKeys.map(featureKey => {
						let data = _.find(this.props.attributesData, {id: featureKey});
						return (
							<React.Fragment key={featureKey}>
								<div>Point: {featureKey}</div>
								{data  ? this.renderContent(data.attributes) : null}
								{/*{data && this.props.attributesMetadata  ? this.renderContent(data.attributes) : null}*/}
							</React.Fragment>
						);
					})}
				</div>
			) : null
		);
	}

	renderContent(attributes) {
		let content = [];
		_.forIn(attributes, (value, attributeKey) => {
			let attributeMetadata = _.find(this.props.attributesMetadata, {key: attributeKey});
			content.push(
				<div key={attributeKey}>{attributeMetadata ? attributeMetadata.data.nameDisplay : attributeKey}: {value}</div>
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
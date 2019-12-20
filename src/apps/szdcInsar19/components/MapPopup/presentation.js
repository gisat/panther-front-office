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
		let featureKeys = null;
		if (this.props.featureKeys) {
			featureKeys = _.uniq(this.props.featureKeys);
		}

		return (
			featureKeys ? (
				<div className="szdcInsar19-map-popup">
					{featureKeys.map(featureKey => {
						let data = _.find(this.props.attributesData, {id: featureKey});
						return (
							<React.Fragment key={featureKey}>
								<div className="ptr-popup-header">
									{featureKey}
								</div>
								{data  ? this.renderContent(data.attributes) : null}
							</React.Fragment>
						);
					})}
				</div>
			) : null
		);
	}

	renderContent(attributes) {
		let content = [];

		_.forEach(this.props.attributeKeys, key => {
			let attributeMetadata = _.find(this.props.attributesMetadata, {key});
			let unit = attributeMetadata && attributeMetadata.data.unit;
			let value = attributes[key];

			if (value) {
				if (typeof value === 'number') {
					if (value && (value % 1) !== 0) {
						value = value.toFixed(2);
					}
					value.toLocaleString();
				}

				content.push(
					<div className="ptr-popup-record-group" key={key}>
						<div className="ptr-popup-record">
							{<div className="ptr-popup-record-attribute">
								{attributeMetadata ? attributeMetadata.data.nameDisplay : key}
							</div> }
							<div className="ptr-popup-record-value-group">
								{value || value === 0 ? <span className="value">{value}</span> : null}
								{unit ? <span className="unit">{unit}</span> : null}
							</div>
						</div>
					</div>
				);
			}
		});

		return (
			<>
				{content}
			</>
		);
	}
}

export default MapPopup;
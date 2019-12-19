import React from 'react';
import _ from 'lodash';

class PointInfo extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps) {
		const selection = this.props.activeSelection;
		if (this.props.activeSelection !== prevProps.activeSelection) {
			let keys = selection && selection.data && selection.data.featureKeysFilter && selection.data.featureKeysFilter.keys;
			if (keys && this.props.onPointsChange) {
				this.props.onPointsChange(keys);
			}
		}
	}

	render() {
		const props = this.props;
		let featureKey = props.activeSelection &&  props.activeSelection.data &&  props.activeSelection.data.featureKeysFilter &&  props.activeSelection.data.featureKeysFilter.keys &&  props.activeSelection.data.featureKeysFilter.keys[0];

		return (
			this.props.data ? (
				<div className="szdcInsar19-point-info">
					<h3>{featureKey}</h3>
					{this.props.data.map(attribute => this.renderAttribute(attribute))}
				</div>
			) : null
		);
	}

	renderAttribute(data) {
		let value = data.value;
		if (typeof value === 'number') {
			value = value.toFixed(3);
		}

		return (
			<div className="szdcInsar19-point-attribute">
				<div>{data.name}</div>
				<span>{value} {data.unit ? data.unit :null}</span>
			</div>
		);
	}
}

export default PointInfo;
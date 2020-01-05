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

		if (this.props.data && this.props.activeSelection) {
			if (_.isObject(this.props.data)) {
				return (
					<div className="szdcInsar19-point-info">
						<h3>{featureKey}</h3>
						<div>
							<h4>selectedPeriod</h4>
							{this.props.data.selectedPeriod && this.props.data.selectedPeriod.map((attribute, index) => this.renderAttribute(attribute, index))}
						</div>
						<div>
							<h4>basePeriod</h4>
							{this.props.data.basePeriod && this.props.data.basePeriod.map((attribute, index) => this.renderAttribute(attribute, index))}
						</div>
						
					</div>
				);
			} else {
				return (
					<div className="szdcInsar19-point-info">
						<h3>{featureKey}</h3>
						{this.props.data.map((attribute, index) => this.renderAttribute(attribute, index))}
					</div>
				);
			}
		}
		
		return null;
	}

	renderAttribute(data, index) {
		let value = data.value;
		if (typeof value === 'number') {
			if (value && (value % 1) !== 0) {
				value = value.toFixed(3);
			}
			value.toLocaleString();
		}

		return (
			<div key={index} className="szdcInsar19-point-attribute" title={data.description}>
				<div>{data.name}</div>
				<span>{value}</span>
				<span>{data.unit ? data.unit :null}</span>
			</div>
		);
	}
}

export default PointInfo;
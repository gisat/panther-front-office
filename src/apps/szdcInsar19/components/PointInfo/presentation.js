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

		return (
			<>
				<h4>007</h4>
				<div className="szdcInsar19-point-attribute">
					<div>attribute name</div>
					<span>13</span>
				</div>
				<div className="szdcInsar19-point-attribute">
					<div>another attribute name</div>
					<span>6.123</span>
				</div>
				<div className="szdcInsar19-point-attribute">
					<div>yet another attribute name</div>
					<span>STABILITY</span>
				</div>
			</>
		);

	}
}

export default PointInfo;
import React from "react";

import PropTypes from "prop-types";

class ChartSet extends React.PureComponent {

	static propTypes = {
		charts: PropTypes.object,
		set: PropTypes.object
	};

	constructor (props) {
		super(props);
	}


	render() {
		return (
			<div className="ptr-charts-container">
				{this.renderCharts()}
			</div>
		);
	}

	renderCharts() {
		if (this.props.set && this.props.set.charts) {
			const charts = this.props.set.charts;

			return charts.map((chartKey, index) => {
				let chart = this.props.charts[chartKey];
				let props = {
					chartKey: chart.key,
					name: chart.data && chart.data.title
				};

				if (this.props.children) {
					return React.cloneElement(this.props.children, {...props, key: chartKey});
				}
			});
		} else {
			return null;
		}
	}
}

export default ChartSet;
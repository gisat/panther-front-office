import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import sample_15 from "../../../components/common/charts/mockData/sample_15";
import sample_200 from "../../../components/common/charts/mockData/sample_200";
import ColumnChart from "../../../components/common/charts/ColumnChart/ColumnChart";

class ColumnChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			width: null
		};
		this.ref = React.createRef();

		this.resize = this.resize.bind(this);
	}

	resize() {
		this.setState({
			width: (window.innerWidth) - 270 // TODO do it better
		})
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize, {passive: true}); //todo IE
	}

	render() {
		return (
			<div className="ptr-docs-panel-content" ref={this.ref}>
				<div className="ptr-docs-panel-section">
					<h2>Basic settings</h2>
					<p>Resize window to see responsiveness.</p>
					<ColumnChart
						key="test3"
						data={sample_15}
						keySourcePath="key"
						xSourcePath="data.name"
						ySourcePath="data.some_value_1"
						sorting={[["data.some_value_1", "desc"]]}
						width={this.state.width}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>With captions</h2>
					<p>It is possible to set both x and y captions.</p>
					<ColumnChart
						key="test3"
						data={sample_15}
						keySourcePath="key"
						xSourcePath="data.name"
						ySourcePath="data.some_value_1"
						sorting={[["data.some_value_1", "desc"]]}
						xCaptions
						yCaptions
						width={this.state.width}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>With captions, ticks, gridlines and without y baseline</h2>
					<ColumnChart
						key="test3"
						data={sample_15}
						keySourcePath="key"
						xSourcePath="data.name"
						ySourcePath="data.some_value_1"
						sorting={[["data.some_value_1", "desc"]]}
						xCaptions
						yCaptions
						xTicks
						yTicks
						xGridlines
						yGridlines
						withoutYbaseline
						width={this.state.width}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>With custom height and width</h2>
					<p>MinWidth should be equal or less than width.</p>
					<ColumnChart
						key="test3"
						data={sample_15}
						keySourcePath="key"
						xSourcePath="data.name"
						ySourcePath="data.some_value_1"
						sorting={[["data.some_value_1", "desc"]]}
						yCaptions
						yGridlines
						withoutYbaseline
						width={250}
						minWidth={200}
						height={150}
					/>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Aggregated</h2>
					<p>Hover the chart area to see aggregation.</p>
					<ColumnChart
						key="test3"
						data={sample_200}
						keySourcePath="key"
						xSourcePath="data.name"
						ySourcePath="data.some_value_1"
						sorting={[["data.some_value_1", "desc"]]}
						yCaptions
						yGridlines
						withoutYbaseline
						width={this.state.width}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(ColumnChartDoc);
import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import sample_15 from "./mockData/sample_15";
import sample_200 from "./mockData/sample_200";
import ColumnChart from "../../../components/common/charts/ColumnChart/ColumnChart";
import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";

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
					<HoverHandler>
						<ColumnChart
							key="test3"
							data={sample_15}
							keySourcePath="key"
							xSourcePath="data.name"
							ySourcePath="data.some_value_1"
							sorting={[["data.some_value_1", "desc"]]}
							width={this.state.width}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>With captions</h2>
					<p>It is possible to set both x and y captions.</p>
					<HoverHandler>
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
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>With captions, ticks, gridlines and without y baseline, custom max and min, attribute name, units</h2>
					<HoverHandler>
						<ColumnChart
							key="test3"
							data={sample_15}
							keySourcePath="key"
							xSourcePath="data.name"
							ySourcePath="data.some_value_1"
							sorting={[["data.some_value_1", "desc"]]}
							xCaptions
							yCaptions
							yCaptionsSize={80}
							xCaptionsSize={80}
							xTicks
							yTicks
							xGridlines
							yGridlines
							withoutYbaseline
							width={this.state.width}
							yOptions={{
								min: -1,
								max: 105000,
								name: "Custom attribute name",
								unit: "ha"
							}}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>With custom height and width</h2>
					<p>MinWidth should be equal or less than width.</p>
					<HoverHandler>
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
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Aggregated</h2>
					<p>Hover the chart area to see aggregation.</p>
					<HoverHandler>
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
							yOptions={{
								name: "Custom attribute name",
								unit: "ha"
							}}
						/>
					</HoverHandler>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(ColumnChartDoc);
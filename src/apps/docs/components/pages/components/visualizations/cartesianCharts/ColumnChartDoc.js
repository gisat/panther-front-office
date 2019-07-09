import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import sample_15 from "../../../../mockData/sample_15";
import sample_200 from "../../../../mockData/sample_200";
import ColumnChart from "../../../../../../../components/common/charts/ColumnChart/ColumnChart";
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";

import Page, {DocsToDo} from '../../../../Page';

class ColumnChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Column chart">
				<DocsToDo>
				<div ref={this.ref}>
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
								xValues
								yValues
							/>
						</HoverHandler>
					</div>
	
					<div className="ptr-docs-panel-section">
						<h2>With captions, ticks, gridlines and without y baseline, custom max and min, attribute name, units, colour from default scheme</h2>
						<HoverHandler>
							<ColumnChart
								key="test3"
								data={sample_15}
								keySourcePath="key"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"
								sorting={[["data.some_value_1", "desc"]]}
								xValues
								yValues
								yValuesSize={5}
								xValuesSize={5}
								xTicks
								yTicks
								xGridlines
								yGridlines
								withoutYbaseline
								yOptions={{
									min: -1,
									max: 105000,
									name: "Custom attribute name",
									unit: "ha"
								}}
	
								colored
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
								yValues
								yGridlines
								withoutYbaseline
								width={15}
								minWidth={12}
								height={10}
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
								yValues
								yGridlines
								withoutYbaseline
								yOptions={{
									name: "Custom attribute name",
									unit: "ha"
								}}
							/>
						</HoverHandler>
					</div>
				</div>
				</DocsToDo>
			</Page>
		);
	}
}

export default withNamespaces()(ColumnChartDoc);
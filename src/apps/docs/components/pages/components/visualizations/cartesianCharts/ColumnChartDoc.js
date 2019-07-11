import React from 'react';
import {withNamespaces} from "react-i18next";
import sample_15 from "../../../../mockData/sample_15";
import sample_200 from "../../../../mockData/sample_200";
import ColumnChart from "../../../../../../../components/common/charts/ColumnChart/ColumnChart";
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";

import Page, {ComponentPropsTable, DocsToDo, SyntaxHighlighter} from '../../../../Page';
import {Link} from "react-router-dom";

class ColumnChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Column chart">
				<div className="ptr-docs-visualizations-intro-example">
					<HoverHandler>
						<ColumnChart
							maxWidth={50}

							key="test3"
							data={sample_15}
							keySourcePath="key"
							nameSourcePath="data.name"
							xSourcePath="data.name"
							ySourcePath="data.some_value_1"

							sorting={[["data.some_value_1", "desc"]]}
						/>
					</HoverHandler>
				</div>
				<DocsToDo>
					Add usage
				</DocsToDo>

				<h2 id="props">Props</h2>
				<p>Bellow are listed specific props for column chart. Other props are common to all cartesian charts (<Link to="/docs/components/visualizations/CartesianCharts">see Cartesian charts documentation</Link>).</p>

				<ComponentPropsTable
					content={[
						{
							name: "defaultSchemeBarColors",
							type: "boolean",
							default: "false",
							description: "By default, all bars in chart have one color. Set to true to have own color for each bar, if there is no color defined in input data."
						}, {
							name: "defaultColor",
							type: "string",
							description: "Default color of bars."
						}, {
							name: "highlightedColor",
							type: "string|object",
							description: "Color which is used for hover."
						}, {}, {
							name: "minBarWidth",
							type: "number",
							default: "4",
							description: "Minimal width of bar in pixels. Bars will be aggregated, if the width is smaller."
						}, {
							name: "barGapRatio",
							type: "number",
							default: "0.4",
							description: "Bar width to gap between bars width ratio."
						}, {}, {
							name: "animateChangeData",
							type: "boolean",
							default: "true",
							description: "???"
						}, {
							name: "hoverValueSourcePath",
							type: "string",
							description: "???"
						}
					]}
				/>

				<h2 id="dataStructure">Input data structure</h2>
				<p>Input data for line chart has to be a collection, where each object must contain (or its children) at least three key-value pairs, one as source for key, one as source for axis x and second as source for axis y.</p>
				<DocsToDo>Add link to using data from serie</DocsToDo>

				<SyntaxHighlighter language="javascript">
					{'const data = [\n' +
					'\t{\n' +
					'\t\tkey: "230bd221-5384-4c09-bfa3-069eacbcfff8",   //use \'key\' as keySourcePath\n' +
					'\t\tdata: {\n' +
					'\t\t\tname: "Missouri",   //use \'data.name\' as nameSourcePath and xSourcePath\n' +
					'\t\t\tvalue: "12.56",   //use \'data.value\' as ySourcePath\n' +
					'\t\t\tcolor: "#ff0000",   //use \'data.color\' as colorSourcePath (if present)\n' +
					'\t\t} \n' +
					'\t}, {\n' +
					'\t\tkey: "91c6851e-c5ef-4165-9b15-8cd987a92904",\n' +
					'\t\tdata: {...}\n'	+
					'\t},\n' +
					'\t...\n' +
					']'}
				</SyntaxHighlighter>


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

								defaultSchemeBarColors
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
import React from 'react';
import { Link } from 'react-router-dom';
import {withNamespaces} from "react-i18next";
import LineChart from "../../../../../../../components/common/charts/LineChart/LineChart";

import sample_serie_4 from "../../../../mockData/sample_serie_4";
import sample_serie_30 from "../../../../mockData/sample_serie_30";
import sample_serie_500 from "../../../../mockData/sample_serie_500";
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";
import Page, {ComponentPropsTable, LightDarkBlock, SyntaxHighlighter} from "../../../../Page";
import ResizableContainer from "../../../../ResizableContainer/ResizableContainer";

class LineChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Line chart">
				<LineChart
					key="line-chart-doc-typical-usage"

					data={sample_serie_4}
					keySourcePath="key"
					nameSourcePath="data.name"
					serieDataSourcePath="data.data"
					xSourcePath="period" // in context of serie
					ySourcePath="someStrangeValue" // in context of serie

					sorting={[["period", "asc"]]} // not required, but recommended
				/>
				<div className="ptr-docs-visualizations-intro-example">
					<HoverHandler>
						<ResizableContainer>
							<LineChart
								key="line-chart-doc-typical-usage"

								data={sample_serie_4}
								keySourcePath="key"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								xSourcePath="period" // in context of serie
								ySourcePath="someStrangeValue" // in context of serie

								sorting={[["period", "asc"]]} // not required, but recommended
							/>
						</ResizableContainer>
					</HoverHandler>
				</div>
				<p>TODO: add typical example and describe usage</p>
				<h2>Props</h2>
				<p>Bellow are listed specific props for line chart. Other props are common to all cartesian charts (<Link to="/docs/components/visualizations/CartesianCharts">see Cartesian charts documentation</Link>).</p>
				<ComponentPropsTable
					content={[
						{
							name: "aggregationThreshold",
							type: "number",
							default: "50",
							description: "If there is more lines than threshold, lines will be aggregated to average, min and max."
						}, {
							name: "forceMode",
							type: "string",
							description: "Set the mode independently of number of lines. Possible values: 'gray' or 'aggregated'"
						}, {
							name: "grayingThreshold",
							type: "number",
							default: "10",
							description: "If there is more lines than threshold, lines will be gray."
						}, {
							name: "withPoints",
							type: "boolean",
							default: "false",
							description: "If true, lines will be rendered with points."
						}
					]}
				/>
				<h3>Input data structure</h3>
				<p>TODO: add description</p>
				<SyntaxHighlighter language="javascript">
					{'const data = [\n' +
					'\t{\n' +
					'\t\tkey: "230bd221-5384-4c09-bfa3-069eacbcfff8",\n' +
					'\t\tdata: {\n' +
					'\t\t\tname: "Missouri",\n' +
					'\t\t\tdata: [{\n' +
					'\t\t\t\tperiod: 2006,\n' +
					'\t\t\t\tsomeStrangeValue: 1532\n' +
					'\t\t\t}, {\n' +
					'\t\t\t\tperiod: 1991,\n' +
					'\t\t\t\tsomeStrangeValue": null\n' +
					'\t\t\t}, ...]\n' +
					'\t\t}\n' +
					'\t}, {\n' +
					'\t\tkey: "91c6851e-c5ef-4165-9b15-8cd987a92904",\n' +
					'\t\tdata: {...}\n'	+
					'\t},\n' +
					'\t...\n' +
					']'}
				</SyntaxHighlighter>

				<h2>Examples</h2>
				<h3>Basic necessary settings</h3>
				<SyntaxHighlighter language="jsx">
					{'// Sorting is not required, but recommended. \n' +
					'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'<HoverHandler>\n' +
					'\t<LineChart \n' +
					'\t\tkey="test1"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tserieDataSourcePath="data.data"\n' +
					'\t\txSourcePath="period"\n' +
					'\t\tySourcePath="someStrangeValue"\n' +
					'\n' +
					'\t\tsorting={[["period", "asc"]]}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock>
					<HoverHandler>
						<ResizableContainer>
							<LineChart
								key="test1"

								data={sample_serie_4}
								keySourcePath="key"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								xSourcePath="period" // in context of serie
								ySourcePath="someStrangeValue" // in context of serie

								sorting={[["period", "asc"]]} // not required, but recommended
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<h3>Axis labels & fixed range</h3>
				<p>It is possible to add a label (title) to both axis and define units. Move cursor over points to see how yOptions setting is reflected and compare it with previous example. Moreover, you can define fixed extreme values for axis y (either minimum, maximum, or both). </p>
				<p> In the example below, the baseline and ticks are added and space for y axis values is extended, whereas space for axis x is shrunken. Furthermore, minWidth and maxWidth is defined to restrict width when resizing.</p>

				<SyntaxHighlighter language="jsx">
					{'// Sorting is not required, but recommended. \n' +
					'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'<HoverHandler>\n' +
					'\t<LineChart \n' +
					'\t\tkey="test1"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tserieDataSourcePath="data.data"\n' +
					'\t\txSourcePath="period"\n' +
					'\t\tySourcePath="someStrangeValue"\n' +
					'\n' +
					'\t\tsorting={[["period", "asc"]]}\n' +
					'\n' +
					'\t\tminWidth={600}\n' +
					'\t\tmaxWidth={800}\n' +
					'\n' +
					'\t\tyValuesSize={60}\n' +
					'\t\tyLabel\n' +
					'\t\tyOptions={{\n' +
					'\t\t\tname: "Population growth",\n' +
					'\t\t\tunit: "inhabitants",\n' +
					'\t\t\tmin: -3001,\n' +
					'\t\t\tmax: 3200\n' +
					'\t\t}}\n' +
					'\t\tyTicks\n' +
					'\t\twithoutYbaseline={false}\n' +
					'\n' +
					'\t\txValuesSize={40}\n' +
					'\t\txLabel\n' +
					'\t\txOptions={{\n' +
					'\t\t\tname: "Years"\n' +
					'\t\t}}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock>
					<HoverHandler>
						<ResizableContainer
							minWidth={35}
							maxWidth={45}
						>
							<LineChart
								key="test1"
								height={20}

								data={sample_serie_4}
								keySourcePath="key"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								xSourcePath="period" // in context of serie
								ySourcePath="someStrangeValue" // in context of serie

								sorting={[["period", "asc"]]} // not required, but recommended

								minWidth={35}
								maxWidth={45}

								yValuesSize={4}
								yLabel
								yOptions={{
									name: "Population growth",
									unit: "inhabitants",
									min: -3001,
									max: 3200
								}}
								yTicks
								withoutYbaseline={false}

								xValuesSize={2.75}
								xLabel
								xOptions={{
									name: "Years"
								}}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

					<h2>Force aggregated</h2>
					<HoverHandler>
						<LineChart
							key="test4"
							data={sample_serie_4}
							keySourcePath="key"
							nameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							forceMode="aggregated"

							xTicks
							xGridlines
							xValues
							yTicks
							yGridlines
							yValues
							withoutYbaseline

							withPoints
							// width={this.state.width}
						/>
					</HoverHandler>

					<h2>Force gray</h2>
					<HoverHandler>
						<LineChart
							key="test5"
							data={sample_serie_4}
							keySourcePath="key"
							nameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							forceMode="gray"

							xTicks
							xGridlines
							xValues
							yTicks
							yGridlines
							yValues
							withoutYbaseline
							sorting={[["period", "asc"]]}

							withPoints
							// width={this.state.width}
						/>
					</HoverHandler>

					<h2>More than 10 series</h2>
					<HoverHandler>
						<LineChart
							key="test3"
							data={sample_serie_30}
							keySourcePath="key"
							nameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							xTicks
							xGridlines
							xValues
							yTicks
							yGridlines
							yValues
							withoutYbaseline

							withPoints
							// width={this.state.width}
						/>
					</HoverHandler>

					<h2>More than 50 series</h2>
					<HoverHandler>
						<LineChart
							key="test500"
							data={sample_serie_500}
							keySourcePath="key"
							nameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							xTicks
							xGridlines
							xValues
							yTicks
							yGridlines
							yValues
							withoutYbaseline

							withPoints
							// width={this.state.width}
						/>
					</HoverHandler>
			</Page>
		);
	}
}

export default withNamespaces()(LineChartDoc);
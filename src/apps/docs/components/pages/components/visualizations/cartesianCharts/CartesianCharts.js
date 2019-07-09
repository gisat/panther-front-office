import React from 'react';
import { Link } from 'react-router-dom';
import Page, {
	ComponentPropsTable,
	DocsToDo,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from "../../../../Page";
import serie_10 from "../../../../mockData/scatterChart/serie_10";
import sample_4 from "../../../../mockData/sample_4";
import sample_15 from "../../../../mockData/sample_15";
import sample_serie_4 from "../../../../mockData/sample_serie_4";
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";
import ColumnChart from "../../../../../../../components/common/charts/ColumnChart/ColumnChart";
import LineChart from "../../../../../../../components/common/charts/LineChart/LineChart";
import ScatterChart from "../../../../../../../components/common/charts/ScatterChart/ScatterChart";
import ResizableContainer from "../../../../ResizableContainer/ResizableContainer";

class CartesianCharts extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Cartesian charts">
				<div className="ptr-docs-visualizations-intro-example">
					<HoverHandler>
						<ColumnChart
							key="column-chart-doc-typical-usage"
							data={sample_4}
							keySourcePath="key"
							nameSourcePath="data.name"
							xSourcePath="data.name"
							ySourcePath="data.some_value_1"
							colorSourcePath="data.color"
							sorting={[["data.some_value_1", "desc"]]}

							xValues={false}
							yValues={false}

							xTicks={false}
							yTicks={false}

							yOptions={{
								min: 0
							}}

							withoutYbaseline={false}

							minAspectRatio={1.7}
						/>
					</HoverHandler>
					<HoverHandler>
						<LineChart
							key="line-chart-doc-typical-usage"

							data={serie_10.slice(7,10)}
							keySourcePath="key"
							nameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							sorting={[["period", "asc"]]} // not required, but recommended

							xValues={false}
							yValues={false}

							xTicks={false}
							yTicks={false}

							withoutYbaseline={false}

							minAspectRatio={1.7}
						/>
					</HoverHandler>
					<HoverHandler>
						<ScatterChart
							key="scatter-chart-doc-typical-usage"
							data={sample_15}

							xSourcePath="data.some_value_1"
							ySourcePath="data.some_value_2"
							nameSourcePath="data.name"
							keySourcePath="key"

							xValues={false}
							yValues={false}

							xTicks={false}
							yTicks={false}

							withoutYbaseline={false}

							minAspectRatio={1.7}
						/>
					</HoverHandler>
				</div>
				<p>Each type of chart is suitable for different use case. For detailed information about proper chart type usage, please go to the particular chart documentation. Based on input data and, mainly, based on the message you want to deliver to your audience, you can choose from following charts:</p>
				<ul className="ptr-docs-basic-list">
					<li><Link to="/docs/components/visualizations/cartesianCharts/columnChart"><b>Column chart</b></Link> - one attribute/indicator at one point in time (e.g. Population in 2015 by country) or multiple comparable (relative, same unit etc.) attributes/indicators for one area at one point in time</li>
					<li><Link to="/docs/components/visualizations/cartesianCharts/lineChart"><b>Line chart</b></Link> - progress of one attribute/indicator (e.g. Population progress between 1985 and 2015 by country) or progress of multiple comparable attributes/indicators for one area</li>
					<li><Link to="/docs/components/visualizations/cartesianCharts/scatterChart"><b>Scatter chart</b></Link> - two attributes/indicators at one point (or even multiple points) in time (e.g. Population growth vs. Urban area growth by country in 2000, 2005 and 2010)</li>
				</ul>

				<h2>Common props</h2>
				<ComponentPropsTable
					content={
						[{
							name: "data",
							type: "array",
							required: true,
							description: "Data load for chart. See particular chart type documentation for a detailed description."
						},{
							name: "keySourcePath",
							type: "string",
							required: true,
							description: "Path to key value in data item object (e.g. 'key' or 'data.key')."
						},{
							name: "nameSourcePath",
							type: "string",
							required: true,
							description: "Path to name value in data item object (e.g. 'name' or 'content.name'). If there is no name column in data, use the path to the key."
						},{
							name: "colorSourcePath",
							type: "string",
							description: "Path to color value in data item object."
						},{
							name: "serieDataSourcePath",
							type: "string",
							description: "Path to serie data in data item object."
						},{
							name: "xSourcePath",
							type: "string",
							required: true,
							description: "Path to value for axis x. The Value could be string or number depending on chart type. If data are serial, the path is in the context of the serie."
						},{
							name: "ySourcePath",
							type: "string",
							required: true,
							description: "Path to value for axis y. The value has to be numeric. If data are serial, the path is in the context of the serie."
						}, {}, {
							name: "sorting",
							type: "array",
							description: "List of sorting pairs. [[path, order]] - if data are serial, path is in the cotext of the serie. Example: [['period', 'asc']] - it sorts data by 'period' column in ascending order."
						}, {}, {
							name: "width",
							type: "number",
							description: "Chart width in rem."
						}, {
							name: "height",
							type: "number",
							default: "15",
							description: "Chart height in rem."
						}, {
							name: "maxWidth",
							type: "number",
							description: "Maximal chart width in rem."
						}, {
							name: "minWidth",
							type: "number",
							default: "10",
							description: "Minimal chart width in rem."
						}, {
							name: "minAspectRatio",
							type: "number",
							description: "Minimal ratio between width and height, otherwise height is adjusted to fit the ratio."
						}, {}, {
							name: "xValuesSize",
							type: "number",
							default: "3",
							description: "Space for values below axis x in rem."
						}, {
							name: "yValuesSize",
							type: "number",
							default: "3",
							description: "Space for values next to axis x in rem."
						}, {}, {
							name: "innerPaddingLeft",
							type: "number",
							default: "0.7",
							description: "Space between chart body and axis x in rem."
						}, {
							name: "innerPaddingRight",
							type: "number",
							default: "0.7",
							description: "Space between chart body and right margin in rem."
						}, {
							name: "innerPaddingTop",
							type: "number",
							default: "0.7",
							description: "Space between chart body and top margin in rem."
						}, {}, {
							name: "xGridlines",
							type: "boolean",
							default: "true/false",
							description: "Show vertical grid. False for column chart by default, otherwise true."
						}, {
							name: "xLabel",
							type: "boolean",
							default: "false",
							description: "Show label (title) of axis x. Its components could be defined in xOptions."
						}, {
							name: "xOptions",
							type: "object",
							objectPropsDescription: [{
								name: "max",
								type: "number",
								description: "Set fixed maximum value, if axis x is linear."
							},{
								name: "min",
								type: "number",
								description: "Set fixed minimum value, if axis x is linear."
							},{
								name: "name",
								type: "string",
								description: "Axis x title."
							},{
								name: "unit",
								type: "string",
								description: "Axis x unit. It's displayed in brackets next to the title."
							}]
						}, {
							name: "xTicks",
							type: "boolean",
							default: "true",
							description: "Show ticks on axis x."
						}, {
							name: "xValues",
							type: "boolean",
							default: "true",
							description: "Show values on axis x."
						},{}, {
							name: "yGridlines",
							type: "boolean",
							default: "true",
							description: "Show horizontal grid."
						}, {
							name: "yLabel",
							type: "boolean",
							default: "false",
							description: "Show label (title) of axis y. Its components could be defined in yOptions."
						}, {
							name: "yOptions",
							type: "object",
							objectPropsDescription: [{
								name: "max",
								type: "number",
								description: "Set fixed maximum value."
							},{
								name: "min",
								type: "number",
								description: "Set fixed minimum value."
							},{
								name: "name",
								type: "string",
								description: "Axis y title."
							},{
								name: "unit",
								type: "string",
								description: "Axis y unit. It's displayed in brackets next to the title."
							}]
						}, {
							name: "yTicks",
							type: "boolean",
							default: "true/false",
							description: "Show ticks on axis y. True for scatter chart by default, otherwise false."
						}, {
							name: "yValues",
							type: "boolean",
							default: "true",
							description: "Show values on axis y."
						}, {
							name: "withoutYbaseline",
							type: "boolean",
							default: "true/false",
							description: "Hide axis y baseline. False for scatter chart by default, otherwise true."
						}, {}, {
							name: "legend",
							type: "boolean",
							default: "false",
							description: "Show legend below chart."
						}]
					}
				/>
				<h2>Examples</h2>
				<h3>Fixed width and height</h3>
				<p>By default, cartesian chart <InlineCodeHighlighter>width</InlineCodeHighlighter> is 100 % of parent container and <InlineCodeHighlighter>height</InlineCodeHighlighter> is 15 rem. However, it is possible to set custom value for both properties.</p>

				<SyntaxHighlighter language="jsx">
					{'// Sorting is not required, but recommended. \n' +
					'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'// The input data structure is described for each chart type separately. \n' +
					'<HoverHandler>\n' +
					'\t<LineChart \n' +
					'\t\tkey="cartesians-docs-chart-width"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tserieDataSourcePath="data.data"\n' +
					'\t\txSourcePath="period"\n' +
					'\t\tySourcePath="someStrangeValue"\n' +
					'\n' +
					'\t\tsorting={[["period","asc"]]}\n' +
					'\n' +
					'\t\twidth={30}\n' +
					'\t\theight={25}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock>
					<HoverHandler>
						<LineChart
							key="cartesians-docs-chart-width"

							data={sample_serie_4}
							keySourcePath="key"
							nameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							sorting={[["period", "asc"]]} // not required, but recommended

							width={30}
							height={25}
						/>
					</HoverHandler>
				</LightDarkBlock>

				<h3>Maximal and minimal width customization</h3>
				<p>If you want to restrict width of the chart, set <InlineCodeHighlighter>minWidth</InlineCodeHighlighter> or <InlineCodeHighlighter>maxWidth</InlineCodeHighlighter> value in rem. Try to resize the chart box in the examples below to see the restriction.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="cartesians-docs-chart-max-min-width"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.some_value_1"\n' +
					'\n' +
					'\t\tsorting={[["data.some_value_1","desc"]]}\n' +
					'\n' +
					'\t\tminWidth={30}\n' +
					'\t\tmaxWidth={45}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock>
					<HoverHandler>
						<ResizableContainer
							minWidth={30}
							maxWidth={45}
						>
							<ColumnChart
								key="cartesians-docs-chart-max-min-width"

								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"

								sorting={[["data.some_value_1", "desc"]]} // not required, but recommended

								minWidth={30}
								maxWidth={45}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<DocsToDo>
					<h3>Minimal aspect ratio</h3>
					<h3>Handling inner padding</h3>
					<h3>Extend space for axis values</h3>
					<h3>Show/hide axis values, ticks and gridlines</h3>
					<h3>Axis labels</h3>
					<h3>Set fixed values range</h3>
					<h3>Show legend</h3>
				</DocsToDo>
			</Page>
		);
	}
}

export default CartesianCharts;
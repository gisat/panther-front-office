import React from 'react';
import { Link } from 'react-router-dom';
import Page, {
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
import ComponentPropsTable from "../../../../ComponentPropsTable/ComponentPropsTable";
import serie_5_time_iso_2hours from "../../../../mockData/timeBased/serie_5_time_iso_2hours";
import serie_50_time_iso_years from "../../../../mockData/timeBased/serie_50_time_iso_years";
import series_logarithmic_10 from "../../../../mockData/logarithmic/series_logarithmic_10";

class CartesianCharts extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Cartesian charts">
				<div className="ptr-docs-visualizations-intro-example cartesian-charts">
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
							// maxWidth={15}
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
							// maxWidth={15}
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
							// maxWidth={15}
						/>
					</HoverHandler>
				</div>
				<p>Each type of chart is suitable for different use case. For detailed information about proper chart type usage, please go to the particular chart documentation. Based on input data and, mainly, based on the message you want to deliver to your audience, you can choose from following charts:</p>
				<ul className="ptr-docs-basic-list">
					<li><Link to="/components/visualizations/cartesianCharts/columnChart"><b>Column chart</b></Link> - one attribute/indicator at one point in time (e.g. Population in 2015 by country) or multiple comparable (relative, same unit etc.) attributes/indicators for one area at one point in time</li>
					<li><Link to="/components/visualizations/cartesianCharts/lineChart"><b>Line chart</b></Link> - progress of one attribute/indicator (e.g. Population progress between 1985 and 2015 by country) or progress of multiple comparable attributes/indicators for one area</li>
					<li><Link to="/components/visualizations/cartesianCharts/scatterChart"><b>Scatter chart</b></Link> - two attributes/indicators at one point (or even multiple points) in time (e.g. Population growth vs. Urban area growth by country in 2000, 2005 and 2010)</li>
				</ul>

				<h2 id="props">Common props</h2>
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
							description: "Path to serie data in data item object. It is required for Line chart."
						},{
							name: "xSourcePath",
							type: "string",
							required: true,
							description: "Path to value for axis x. The Value could be string or number depending on chart type. If data are serial, the path is in the context of the serie."
						},{
							name: "ySourcePath",
							type: "string|array",
							required: true,
							description: <>Path to value for axis y. The value has to be numeric. If data are serial, the path is in the context of the serie. It could be a collection as well (See <Link to="/components/visualizations/cartesianCharts/columnChart#stacked">stacked column charts</Link>).</>
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
							},{
								name: "diversionValue",
								type: "number",
								description: "Use together with 'diverging' prop to move axis Y baseline to this value. Scale of axis X has to be linear (currently useful for scatter charts only). By default 0."
							},{
								name: "startingTick",
								type: "number",
								default: 0,
								description: "Show ticks (and value labels, gridlines) starting from this position. For ordinal scales only."
							},{
								name: "tickStep",
								type: "number",
								default: 1,
								description: "Show every nth tick (and value label, gridline). For ordinal scales only."
							},{
								name: "axisValueFormat",
								type: "string",
								description: <>Time format used as x axis value label. Use together with xScaleType='time'. See <a href="https://momentjs.com/docs/#/displaying/" target="_blank">MomentJS documentation</a> to set the format correctly.</>
							},{
								name: "popupValueFormat",
								type: "string",
								description: <>Time format used in popup. Use together with xScaleType='time'. See <a href="https://momentjs.com/docs/#/displaying/" target="_blank">MomentJS documentation</a> to set the format correctly.</>
							},{
								name: "inputValueFormat",
								type: "string",
								description: <>Time format which should be used for parsing input data. Use if source data for time are not in ISO 8601 date and time format (2000-12-31T07:02:44). Currently implemented for <b>line charts only</b>. Use together with xScaleType='time'. See <a href="https://momentjs.com/docs/#/displaying/" target="_blank">MomentJS documentation</a> to set the format correctly.</>
							},{
								name: "timeValueLanguage",
								type: "string",
								description: <>Languge used for time values. Possible values 'en' (default) or 'cs'. Other languages are possible, but not implemented yet.</>
							}]
						}, {
							name: "xTicks",
							type: "boolean",
							default: "true",
							description: "Show ticks on axis x."
						}, {
							name: "xScaleType",
							type: "string",
							default: "'ordinal'/'linear'",
							description: <>Possible values are for column chart - ordinal (default); for line chart - ordinal (default), time; for scatter chart - linear (default), time. ISO 8601 date and time format (2000-12-31T07:02:44) is recommended for input data. See <Link to={"#scales"}>Scales section</Link> how to use different scale types.</>
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
							},{
								name: "diversionValue",
								type: "number",
								description: "Use together with 'diverging' prop to move axis X baseline to this value. By default 0."
							}, {
								name: "highlightedArea",
								type: "object",
								description: "Using 'from' and 'to' define the area in the chart which will be highlighted."
							}]
						}, {
							name: "yScaleType",
							type: "string",
							default: "'linear'",
							description: <>Possible values are for column chart - linear (default); for line chart - linear (default), logarithmic; for scatter chart - linear (default). See <Link to="#scales">Scales section</Link> how to use different scale types.</>
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
						}, {}, {
							name: "diverging",
							type: "string|boolean",
							description: (<>Use if the values are diverging from some point (defined in xOptions or yOptions). See <Link to="/components/visualizations/cartesianCharts/columnChart#diverging">Diverging column chart</Link> to find out more. Possible values: 'single', 'double'. If double, ySourcePath must be an array containing paths to both values. If value is not defined, 'single' is used by default.</>)
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

				<LightDarkBlock forceRows>
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

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
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

				<h3>Minimal aspect ratio</h3>
				<p>Minimal aspect ratio defines minimal allowed width to height ratio. If this ratio is higher than defined value, the height is adjusted to fit <InlineCodeHighlighter>minAcpectRatio</InlineCodeHighlighter>. Try to resize the box in the example below to see the height adjustment.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ScatterChart \n' +
					'\t\tkey="cartesians-docs-chart-min-aspect-ratio"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.some_value_1"\n' +
					'\t\tySourcePath="data.some_value_2"\n' +
					'\n' +
					'\t\tminAspectRatio={1.5}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ScatterChart
								key="cartesians-docs-chart-min-aspect-ratio"

								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.some_value_1"
								ySourcePath="data.some_value_2"

								minAspectRatio={1.5}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<h3>Handling inner padding</h3>
				<p>Inner padding defines the space between plot area edge and plot itself in rem values. Currently, it is possible to set <InlineCodeHighlighter>innerPaddingLeft</InlineCodeHighlighter> - space between plot and axis y, <InlineCodeHighlighter>innerPaddingTop</InlineCodeHighlighter> - space between plot and the top edge of the chart area, and <InlineCodeHighlighter>innerPaddingRight</InlineCodeHighlighter> - space between plot and the right edge of the chart.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<LineChart \n' +
					'\t\tkey="cartesians-docs-chart-inner-padding"\n' +
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
					'\t\tinnerPaddingLeft={0}\n' +
					'\t\tinnerPaddingTop={4}\n' +
					'\t\tinnerPaddingRight={2}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<LineChart
								key="cartesians-docs-chart-width"

								data={sample_serie_4}
								keySourcePath="key"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								xSourcePath="period" // in context of serie
								ySourcePath="someStrangeValue" // in context of serie

								sorting={[["period", "asc"]]} // not required, but recommended

								innerPaddingLeft={0}
								innerPaddingRight={2}
								innerPaddingTop={4}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<h3>Axis customization</h3>
				<p>There are plenty of options to customize both axis x and axis y. In the example below, there are listed all props associated with axis for clarity, even if some of them are truthy by default for column chart (<Link to={{hash: "#props"}}>See props table in the top of this page</Link>).</p>
				<p>The values next to axis y (<InlineCodeHighlighter>yValues</InlineCodeHighlighter>) and below axis x (<InlineCodeHighlighter>xValues</InlineCodeHighlighter>) should be shown by default. However, the default space may not to be enough for them (or is too large on the other hand ). For such cases, it is possible to adjust space for values using <InlineCodeHighlighter>xValuesSize</InlineCodeHighlighter> or <InlineCodeHighlighter>yValuesSize</InlineCodeHighlighter>.</p>
				<p>To increase readability you can switch on or off gridlines (<InlineCodeHighlighter>xGridlines</InlineCodeHighlighter> - auxiliary horizontal lines, <InlineCodeHighlighter>yGridlines</InlineCodeHighlighter> - auxiliary vertical lines) and ticks (<InlineCodeHighlighter>xTicks</InlineCodeHighlighter>, <InlineCodeHighlighter>yTicks</InlineCodeHighlighter>) for both axis.</p>
				<p>Use <InlineCodeHighlighter>xLabel</InlineCodeHighlighter>/<InlineCodeHighlighter>yLabel</InlineCodeHighlighter> to add label (title) for axis x/axis y. Source data for the label must be defined in <InlineCodeHighlighter>xOptions</InlineCodeHighlighter>/<InlineCodeHighlighter>yOptions</InlineCodeHighlighter> object as you can see in the example below.</p>
				<p>Furthermore, you can extend minimum and maximum for axis y (or even for axis x, if its scale is linear - e.g. scatter chart) in the options object.</p>
				<p>If you want to highlight certain area in the chart (e.g. emphasize filter range), you can define the <InlineCodeHighlighter>highlightedArea</InlineCodeHighlighter> object in <InlineCodeHighlighter>yOptions</InlineCodeHighlighter>. Specify <InlineCodeHighlighter>from</InlineCodeHighlighter> and <InlineCodeHighlighter>to</InlineCodeHighlighter> property to set the range on axis y which should be highlighted.</p>
				<p>For axis y, there is an additional prop <InlineCodeHighlighter>withoutYbaseline</InlineCodeHighlighter>nset to false. It means show the baseline of axis Y, because the baseline is hidden by default for column chart.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="cartesians-docs-chart-axis"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.some_value_1"\n' +
					'\n' +
					'\t\tsorting={[["data.some_value_1","desc"]]}\n' +
					'\n' +
					'\t\txGridlines\n' +
					'\t\txOptions={{\n' +
					'\t\t\tname: "U.S. states"\n' +
					'\t\t}}\n' +
					'\t\txLabel\n' +
					'\t\txTicks\n' +
					'\t\txValues\n' +
					'\t\txValuesSize={5}\n' +
					'\n' +
					'\t\tyGridlines\n' +
					'\t\tyOptions={{\n' +
					'\t\t\tname: "Urban Area"\n' +
					'\t\t\tunit: "sqkm"\n' +
					'\t\t\tmin: 0\n' +
					'\t\t\tmax: 104000\n' +
					'\t\t\thighlightedArea: {\n' +
					'\t\t\t\tfrom: 30000\n' +
					'\t\t\t\tto: 60000\n' +
					'\t\t\t}\n' +
					'\t\t}}\n' +
					'\t\tyLabel\n' +
					'\t\tyTicks\n' +
					'\t\tyValues\n' +
					'\t\tyValuesSize={4.5}\n' +
					'\n' +
					'\t\twithoutYbaseline={false}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="cartesians-docs-chart-max-min-width"

								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"

								sorting={[["data.some_value_1", "desc"]]} // not required, but recommended

								xGridlines
								xOptions={{
									name: "U.S. states"
								}}
								xLabel
								xTicks
								xValues
								xValuesSize={5}

								yGridlines
								yOptions={{
									name: "Urban Area",
									unit: "sqkm",
									min: 0,
									max: 104000,
									highlightedArea: {
										from: 30000,
										to: 60000
									}
								}}
								yLabel
								yTicks
								yValues
								yValuesSize={4.5}

								withoutYbaseline={false}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<h3 id="scales">Scales</h3>

				<p>Currently, this functionality is under development. However, it is possible to use some basic scale types for both axis x and y in line chart and scatter chart.</p>

				<h4>Line chart</h4>
				<p>For line chart, the default scale of axis y is linear (all line chart examples above). Optionally it is possible to use logarithmic scale: <InlineCodeHighlighter>yScaleType="logarithmic"</InlineCodeHighlighter>. Use logarithmic scale type together with <InlineCodeHighlighter>yOptions (min, max, tickCount).</InlineCodeHighlighter> to get nice rounded values and gridlines on axis y.</p>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<LineChart
								key="time-scale-line"

								data={series_logarithmic_10}
								keySourcePath="key"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								xSourcePath="time" // in context of serie
								ySourcePath="otherValue" // in context of serie

								yScaleType="logarithmic"
								yOptions={{
									min: 0.01,
									max: 100,
									tickCount: 4
								}}

								sorting={[["time", "asc"]]} // not required, but recommended
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<p>For axis x, the default scale is ordinal (all line chart examples above). Another scale you can use for axis x is time-based by setting <InlineCodeHighlighter>xScaleType="time"</InlineCodeHighlighter>. It is recommended to specify <InlineCodeHighlighter>axisValueFormat</InlineCodeHighlighter> and <InlineCodeHighlighter>popupValueFormat</InlineCodeHighlighter> to format axis x value labels and values in popups. Additionally, if the input data which represents the period is not in ISO 8601 date and time format (2000-12-31T07:02:44), specify <InlineCodeHighlighter>inputValueFormat</InlineCodeHighlighter> (this functionality is experimental).</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<LineChart \n' +
					'\t\tkey="time-scale-line"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="period"\n' +
					'\t\tySourcePath="someStrangeValue"\n' +
					'\n' +
					'\t\tisSerie\n' +
					'\t\tpointRadius={3}\n' +
					'\n' +
					'\t\txScaleType="time"\n' +
					'\t\txOptions={{\n' +
					'\t\t\tname: "Time"\n' +
					'\t\t\taxisValueFormat "YYYY"\n' +
					'\t\t\tpopupValueFormat: "YYYY"\n' +
					'\t\t\tinputValueFormat "YYYY"\n' +
					'\t\t}}\n' +
					'\n' +
					'\t\tyOptions={{\n' +
					'\t\t\tunit: "inhabitans"\n' +
					'\t\t}}\n' +
					'\n' +
					'\t\tdiverging\n' +
					'\t\tsorting={[["period", "asc"]]}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<LineChart
								key="time-scale-line"

								xScaleType="time"

								data={sample_serie_4}
								keySourcePath="key"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								xSourcePath="period" // in context of serie
								ySourcePath="someStrangeValue" // in context of serie

								xOptions={{
									inputValueFormat: 'YYYY',
									axisValueFormat: 'YYYY',
									popupValueFormat: 'YYYY',
									name: 'Time',
								}}

								yOptions={{
									unit: "inhabitans"
								}}

								diverging
								sorting={[["period", "asc"]]} // not required, but recommended
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<h4>Scatter chart</h4>
				<p>For axis x, the default scale is linear (all line chart examples above). Another scale you can use for axis x is time-based by setting <InlineCodeHighlighter>xScaleType="time"</InlineCodeHighlighter>. It is recommended to specify <InlineCodeHighlighter>axisValueFormat</InlineCodeHighlighter> and <InlineCodeHighlighter>popupValueFormat</InlineCodeHighlighter> to format axis x value labels and values in popups.</p>
				<p>See the examples bellow how different time ranges are handled. An optional range of axis x is set in the first example. In the second example, time scale on axis x is combined with linear scale with diverging values on axis y.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ScatterChart \n' +
					'\t\tkey="time-scale-scatter-2"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="time"\n' +
					'\t\tySourcePath="some_value_1"\n' +
					'\n' +
					'\t\tisSerie\n' +
					'\t\tpointRadius={3}\n' +
					'\n' +
					'\t\txScaleType="time"\n' +
					'\t\txOptions={{\n' +
					'\t\t\tname: "Time"\n' +
					'\t\t\taxisValueFormat "YYYY"\n' +
					'\t\t\tpopupValueFormat: "D MMMM YYYY"\n' +
					'\t\t\tname: "Time"\n' +
					'\t\t\tmax "2022-01-01T00:00:00"\n' +
					'\t\t\tmin "2012-01-01T00:00:00"\n' +
					'\t\t}}\n' +
					'\n' +
					'\t\tyOptions={{\n' +
					'\t\t\tname: "Temperature"\n' +
					'\t\t\tunit: "°C"\n' +
					'\t\t}}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ScatterChart
								key="time-scale-scatter-2"
								data={serie_50_time_iso_years}

								xSourcePath="time"
								ySourcePath="some_value_1"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								keySourcePath="key"

								isSerie
								pointRadius={3}

								xScaleType="time"
								xOptions={{
									max: '2022-01-01T00:00:00',
									min: '2012-01-01T00:00:00',
									axisValueFormat: 'YYYY',
									popupValueFormat: 'D MMMM YYYY',
									name: 'Time'
								}}

								yOptions={{
									name: 'Temperature',
									unit: '°C'
								}}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ScatterChart \n' +
					'\t\tkey="time-scale-scatter"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="time"\n' +
					'\t\tySourcePath="some_value_1"\n' +
					'\n' +
					'\t\tisSerie\n' +
					'\t\tpointRadius={3}\n' +
					'\n' +
					'\t\txScaleType="time"\n' +
					'\t\txOptions={{\n' +
					'\t\t\tname: "Time"\n' +
					'\t\t\taxisValueFormat "H:mm"\n' +
					'\t\t\tpopupValueFormat: "D MMMM YYYY (H:mm)"\n' +
					'\t\t\tname: "Time"\n' +
					'\t\t}}\n' +
					'\t\txValuesSize={5}\n' +
					'\n' +
					'\t\tyOptions={{\n' +
					'\t\t\tname: "Temperature"\n' +
					'\t\t\tunit: "°C"\n' +
					'\t\t\tmin: -100\n' +
					'\t\t\tmax: +100\n' +
					'\t\t}}\n' +
					'\t\tyLabel\n' +
					'\t\tyTicks={false}\n' +
					'\n' +
					'\t\twithoutYbaseline={false}\n' +
					'\t\tdiverging\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ScatterChart
								key="time-scale-scatter"
								data={serie_5_time_iso_2hours}

								xSourcePath="time"
								ySourcePath="some_value_1"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								keySourcePath="key"

								isSerie
								pointRadius={3}

								xScaleType="time"
								xValuesSize={5}
								xOptions={{
									axisValueFormat: 'H:mm',
									popupValueFormat: 'D MMMM YYYY (H:mm)',
									name: 'Time'
								}}

								yLabel
								yTicks={false}
								yOptions={{
									name: 'Temperature',
									unit: '°C',
									min: -100,
									max: 100
								}}

								diverging
								withoutYbaseline={true}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>



				<h3>Show legend</h3>
				<p>A legend could be used in line chart or scatter and is hidden by default. To show the legend just add <InlineCodeHighlighter>legend</InlineCodeHighlighter> prop. In the examples below you can se the legend usage for all types of cartesian charts.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<LineChart \n' +
					'\t\tkey="cartesians-docs-chart-legend-line"\n' +
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
					'\t\tlegend\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<LineChart
								key="cartesians-docs-chart-legend-line"

								data={sample_serie_4}
								keySourcePath="key"
								nameSourcePath="data.name"
								serieDataSourcePath="data.data"
								xSourcePath="period" // in context of serie
								ySourcePath="someStrangeValue" // in context of serie

								sorting={[["period", "asc"]]} // not required, but recommended

								legend
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ScatterChart \n' +
					'\t\tkey="cartesians-docs-chart-legend-scatter"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.some_value_1"\n' +
					'\t\tySourcePath="data.some_value_2"\n' +
					'\n' +
					'\t\tdefaultSchemeBarColors\n' +
					'\t\tlegend\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ScatterChart
								key="cartesians-docs-chart-legend-scatter"

								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.some_value_1"
								ySourcePath="data.some_value_2"

								defaultSchemePointColors
								legend
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>
			</Page>
		);
	}
}

export default CartesianCharts;
import React from 'react';
import { Link } from 'react-router-dom';
import Page, {ComponentPropsTable} from "../../../../Page";

class CartesianCharts extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Cartesian charts">
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
							default: "500",
							description: "Chart width in px."
						}, {
							name: "height",
							type: "number",
							default: "250",
							description: "Chart height in px."
						}, {
							name: "maxWidth",
							type: "number",
							default: "1000",
							description: "Maximal chart width in px."
						}, {
							name: "minWidth",
							type: "number",
							default: "150",
							description: "Minimal chart width in px."
						}, {
							name: "minAspectRatio",
							type: "number",
							description: "Minimal ratio between width and height, otherwise height is adjusted to fit the ratio."
						}, {}, {
							name: "xValuesSize",
							type: "number",
							default: "50",
							description: "Space for values below axis x."
						}, {
							name: "yValuesSize",
							type: "number",
							default: "50",
							description: "Space for values next to axis x."
						}, {}, {
							name: "innerPaddingLeft",
							type: "number",
							default: "10",
							description: "Space between chart body and axis x."
						}, {
							name: "innerPaddingRight",
							type: "number",
							default: "10",
							description: "Space between chart body and right margin."
						}, {
							name: "innerPaddingTop",
							type: "number",
							default: "10",
							description: "Space between chart body and top margin."
						}, {}, {
							name: "xGridlines",
							type: "boolean",
							default: "false",
							description: "Show vertical grid."
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
							default: "false",
							description: "Show ticks on axis x."
						}, {
							name: "xValues",
							type: "boolean",
							default: "false",
							description: "Show values on axis x."
						},{}, {
							name: "yGridlines",
							type: "boolean",
							default: "false",
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
							default: "false",
							description: "Show ticks on axis y."
						}, {
							name: "yValues",
							type: "boolean",
							default: "false",
							description: "Show values on axis y."
						}, {
							name: "withoutYbaseline",
							type: "boolean",
							default: "false",
							description: "Hide axis y baseline."
						}, {}, {
							name: "legend",
							type: "boolean",
							default: "false",
							description: "Show legend below chart."
						}]
					}
				/>
			</Page>
		);
	}
}

export default CartesianCharts;
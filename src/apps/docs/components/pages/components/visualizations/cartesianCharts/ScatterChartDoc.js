import React from 'react';
import {withNamespaces} from '@gisatcz/ptr-locales';
import {HoverHandler} from "@gisatcz/ptr-core";
import {ScatterChart} from '@gisatcz/ptr-charts';

import sample_50 from "../../../../mockData/sample_50";

import sample_serie_10 from "../../../../mockData/scatterChart/serie_10";
import Page, {DocsToDo, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../../Page";
import ComponentPropsTable from "../../../../ComponentPropsTable/ComponentPropsTable";
import {Link} from "react-router-dom";
import ResizableContainer from "../../../../ResizableContainer/ResizableContainer";

class ScatterChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Scatter chart">
				<div className="ptr-docs-visualizations-intro-example">
					<HoverHandler>
						<ScatterChart
							key="typical-usage"
							data={sample_50}

							xSourcePath="data.some_value_1"
							ySourcePath="data.some_value_2"
							zSourcePath="data.some_value_1"
							nameSourcePath="data.name"
							keySourcePath="key"

							innerPaddingRight={0}
							innerPaddingTop={0}
							innerPaddingLeft={0}

							maxWidth={30}
						/>
					</HoverHandler>
				</div>

				<p>A scatter chart is a type of chart using Cartesian coordinates to display values for two attributes. One attribute value is the position on the horizontal axis x and second attribute value is the position on the vertical axis y. Use this type of chart to <b>show relation between two attributes</b> for one or multiple cases in one or multiple points in time.</p>



				<h2 id="props">Props</h2>
				<p>Bellow are listed specific props for scatter chart. Other props are common to all cartesian charts (<Link to="/components/visualizations/CartesianCharts">see Cartesian charts documentation</Link>).</p>
				<ComponentPropsTable
					content={[
						{
							name: "defaultSchemePointColors",
							type: "boolean",
							default: "false",
							description: "By default, all points in chart have one color. Set to true to have own color for each point (or serie), if there is no color defined in input data."
						}, {
							name: "pointRadius",
							type: "number",
							default: "5",
							description: "Radius of points in pixels."
						}, {
							name: "isSerie",
							type: "boolean",
							default: "false",
							description: "True for serial source data."
						}, {
							name: "itemNameSourcePath",
							type: "string",
							description: "Required if isSerie is true."
						}, {}, {
							name: "zSourcePath",
							type: "string",
							description: "Path to value for point size. If data are serial, the path is in the context of the serie."
						}, {
							name: "zOptions",
							type: "object",
							objectPropsDescription: [{
								name: "name",
								type: "string",
								description: "Z attrribute title."
							},{
								name: "unit",
								type: "string",
								description: "Z attribute units"
							}]
						}
					]}
				/>



				<h2 id="dataStructure">Input data structure</h2>
				<p>There are two ways of data structure for scatter chart:</p>
				<ul className="ptr-docs-basic-list">
					<li><b>Basic</b> - collection, where each object (or its children) must contain at least 4 key-value pairs, one as a source for key, second a source of name, third as a source for axis x and fourth as a source for axis y.</li>
					<li><b>Serial</b> - collection, where each object must contain at least source for key, name and collection of attribute data objects. The attribute data object must contain at least three key-value pairs, one as source for axis x, second as source for axis y and third as source for item name (such a period).</li>
				</ul>

				<h3>Example of basic data structure</h3>
				<SyntaxHighlighter language="javascript">
					{'const data = [\n' +
					'\t{\n' +
					'\t\tkey: "230bd221-5384-4c09-bfa3-069eacbcfff8",   //use \'key\' as keySourcePath\n' +
					'\t\tdata: {\n' +
					'\t\t\tcolor: "#ff0000",   //use \'data.color\' as colorSourcePath (if present)\n' +
					'\t\t\tname: "Missouri",   //use \'data.name\' as nameSourcePath\n' +
					'\t\t\tattribute_1: "12.56",   //use \'data.attribute_1\' as xSourcePath\n' +
					'\t\t\tattribute_2: "-45",   //use \'data.attribute_2\' as ySourcePath\n' +
					'\t\t} \n' +
					'\t}, {\n' +
					'\t\tkey: "91c6851e-c5ef-4165-9b15-8cd987a92904",\n' +
					'\t\tdata: {...}\n'	+
					'\t},\n' +
					'\t...\n' +
					']'}
				</SyntaxHighlighter>

				<h3>Example of serial data structure</h3>
				<SyntaxHighlighter language="javascript">
					{'const data = [\n' +
					'\t{\n' +
					'\t\tkey: "230bd221-5384-4c09-bfa3-069eacbcfff8",   //use \'key\' as keySourcePath\n' +
					'\t\tdata: {\n' +
					'\t\t\tname: "Missouri",   //use \'data.name\' as nameSourcePath\n' +
					'\t\t\tcolor: "#ff0000",   //use \'data.color\' as colorSourcePath (if present)\n' +
					'\t\t\tdata: [{   //use \'data.data\' as serieDataSourcePath\n' +
					'\t\t\t\tperiod: 2006,   //use \'period\' as itemNameSourcePath\n' +
					'\t\t\t\tsomeStrangeValue: 1532   //use \'someStrangeValue\' as xSourcePath\n' +
					'\t\t\t\totherValue: -25   //use \'otherValue\' as ySourcePath\n' +
					'\t\t\t}, {\n' +
					'\t\t\t\tperiod: 1991,\n' +
					'\t\t\t\tsomeStrangeValue: 2536\n' +
					'\t\t\t\totherValue: -22.54\n' +
					'\t\t\t}, ...]\n' +
					'\t\t}\n' +
					'\t}, {\n' +
					'\t\tkey: "91c6851e-c5ef-4165-9b15-8cd987a92904",\n' +
					'\t\tdata: {...}\n'	+
					'\t},\n' +
					'\t...\n' +
					']'}
				</SyntaxHighlighter>



				<h2 id="basicSettings">Basic necessary settings</h2>

				<SyntaxHighlighter language="jsx">
					{'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'<HoverHandler>\n' +
					'\t<ScatterChart \n' +
					'\t\tkey="basic-settings"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.some_value_1"\n' +
					'\t\tySourcePath="data.some_value_2"\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ScatterChart
								key="basic-settings"
								data={sample_50}

								xSourcePath="data.some_value_1"
								ySourcePath="data.some_value_2"
								nameSourcePath="data.name"
								keySourcePath="key"
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>



				<h2 id="pointRadius">Point radius</h2>
				<p>By default, the chart point has 5 pixels wide radius. Set the <InlineCodeHighlighter>pointRadius</InlineCodeHighlighter> property to the size you prefer. Remember, too small or too big points can decrease readability, as you can see in the example bellow.</p>

				<SyntaxHighlighter language="jsx">
					{'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'<HoverHandler>\n' +
					'\t<ScatterChart \n' +
					'\t\tkey="point-radius"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.some_value_1"\n' +
					'\t\tySourcePath="data.some_value_2"\n' +
					'\n' +
					'\t\tpointRadius={10}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ScatterChart
								key="point-radius"
								data={sample_50}

								xSourcePath="data.some_value_1"
								ySourcePath="data.some_value_2"
								nameSourcePath="data.name"
								keySourcePath="key"

								pointRadius={10}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<h2 id="serialData">Serial data handling</h2>

				<p>In some cases, it will be useful if every point has its own color (for example to distinguish between data series). There are two options to achieve it. Either use <InlineCodeHighlighter>defaultSchemePointColors</InlineCodeHighlighter> to assign colors from D3 scheme, or define your own colors in input data. Then use <InlineCodeHighlighter>colorSourcePath</InlineCodeHighlighter> property instead.</p>

				<p>In the example below we use serial data source. To determine we are using serial data the <InlineCodeHighlighter>isSerie</InlineCodeHighlighter>, <InlineCodeHighlighter>serieDataSourcePath</InlineCodeHighlighter> and <InlineCodeHighlighter>itemNameSourcePath</InlineCodeHighlighter> props are required. See the <Link to='#dataStructure'>Input data structure</Link> section how to set these props.</p>

				<SyntaxHighlighter language="jsx">
					{'// Notice all the props needed if data are serial. \n' +
					'<HoverHandler>\n' +
					'\t<ScatterChart \n' +
					'\t\tkey="colors"\n' +
					'\t\tdata={data}\n' +
					'\n' +
					'\t\tisSerie\n' +
					'\t\tserieDataSourcePath="data.data"\n' +
					'\t\titemNameSourcePath="period"\n' +
					'\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\n' +
					'\t\txSourcePath="someStrangeValue"\n' +
					'\t\tySourcePath="otherValue"\n' +
					'\n' +
					'\t\txOptions={{\n' +
					'\t\t\tname: "Population total"\n' +
					'\t\t\tunit: "inhabitans"\n' +
					'\t\t}}\n' +
					'\n' +
					'\t\tyOptions={{\n' +
					'\t\t\tname: "Population change"\n' +
					'\t\t\tunit: "%"\n' +
					'\t\t}}\n' +
					'\n' +
					'\t\tlegend\n' +
					'\t\tdefaultSchemePointColors\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ScatterChart
								key="colors"
								data={sample_serie_10}

								isSerie
								serieDataSourcePath="data.data"
								itemNameSourcePath="period" // in context of serie

								nameSourcePath="data.name"
								keySourcePath="key"

								xSourcePath="someStrangeValue" // in context of serie
								xOptions={{
									name: "Population total",
									unit: "inhabitants"
								}}
								ySourcePath="otherValue" // in context of serie
								yOptions={{
									name: "Population change",
									unit: "%"
								}}

								legend

								defaultSchemePointColors
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>
			</Page>
		);
	}
}

export default withNamespaces()(ScatterChartDoc);
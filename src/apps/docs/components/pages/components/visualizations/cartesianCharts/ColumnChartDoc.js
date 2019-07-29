import React from 'react';
import {withNamespaces} from "react-i18next";
import sample_15 from "../../../../mockData/sample_15";
import sample_200 from "../../../../mockData/sample_200";
import sample_serie_4 from "../../../../mockData/sample_serie_4";
import diverging_stacked from "../../../../mockData/columnChart/diverging_stacked_sample";
import ColumnChart from "../../../../../../../components/common/charts/ColumnChart/ColumnChart";
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";

import Page, {
	DocsToDoInline,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from '../../../../Page';
import {Link} from "react-router-dom";
import ResizableContainer from "../../../../ResizableContainer/ResizableContainer";
import ComponentPropsTable from "../../../../ComponentPropsTable/ComponentPropsTable";

class ColumnChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Column chart">
				{/*<h2 id="stacked">Stacked bars</h2>*/}

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="diverging-chart"
								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_2"

								sorting={[["data.some_value_2", "desc"]]}

								diverging
								xGridlines
								yOptions={{
									diversionValue: 2
								}}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				{/*<LightDarkBlock forceRows>*/}
					{/*<HoverHandler>*/}
						{/*<ResizableContainer>*/}
							{/*<ColumnChart*/}
								{/*key="diverging-chart"*/}
								{/*data={diverging_stacked}*/}
								{/*keySourcePath="key"*/}
								{/*nameSourcePath="data.name"*/}
								{/*xSourcePath="data.name"*/}
								{/*ySourcePath={[*/}
									{/*{*/}
										{/*path: "data.part1",*/}
										{/*name: "Part 1",*/}
										{/*color: "#ff0000"*/}
									{/*},{*/}
										{/*path: "data.part2",*/}
										{/*name: "Part 2",*/}
										{/*color: "#00ff00"*/}
									{/*},{*/}
										{/*path: "data.part1",*/}
										{/*name: "Part 1",*/}
										{/*color: "#ff00ff"*/}
									{/*}*/}
								{/*]}*/}

								{/*stacked*/}
							{/*/>*/}
						{/*</ResizableContainer>*/}
					{/*</HoverHandler>*/}
				{/*</LightDarkBlock>*/}


				<div className="ptr-docs-visualizations-intro-example">
					<HoverHandler>
						<ColumnChart
							maxWidth={50}

							key="typical-example"
							data={sample_15}
							keySourcePath="key"
							nameSourcePath="data.name"
							xSourcePath="data.name"
							ySourcePath="data.some_value_1"

							sorting={[["data.some_value_1", "desc"]]}
							xValuesSize={5}
						/>
					</HoverHandler>
				</div>
				<p>A column chart presents categorical data with rectangular bars with heights proportional to the values that they represent. Currently, the column charts can show vertical bars only. Use this type of chart to <b>show attribute value for multiple cases</b> ( e.g. areas), or to show multiple comparable attribute values for one case.</p>

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
							description: "Rendering of values is by default animated. Sometime we want fast switch of values without animation. Set to false to turn off animation."
						}, {
							name: "hoverValueSourcePath",
							type: "string",
							description: <>Path to value show in hover. If 'hoverValueSourcePath' is undefined, then 'valueSourcePath' use as value. <Link to="/docs/components/visualizations/asterChart#customHover"><b>example in Aster chart</b></Link></> 
						},
					]}
				/>

				<h2 id="dataStructure">Input data structure</h2>
				<p>Input data for line chart has to be a collection, where each object (or its children) must contain at least three key-value pairs, one as a source for key, second as a source for axis x and third as a source for axis y.</p>
				<p>As the data source it is possible to use <Link to="/docs/components/visualizations/cartesianCharts/lineChart#dataStructure">the same data structure as for line chart</Link> as well. See how such data source is handled in the section <Link to="#serialData">Serial data input handling.</Link></p>

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




				<h2 id="basicSettings">Basic necessary settings</h2>
				<SyntaxHighlighter language="jsx">
					{'// Sorting is not required, but recommended. \n' +
					'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="basic-settings"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.some_value_1"\n' +
					'\n' +
					'\t\tsorting={[["data.some_value_1","asc"]]}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="basic-settings"
								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"

								sorting={[["data.some_value_1", "asc"]]}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="serialData">Serial data input handling</h2>
				<p>It is possible to use data in serial structure as input data for column chart. Examine <Link to="/docs/components/visualizations/cartesianCharts/lineChart#dataStructure">the Line chart documentation</Link> to get an overview of the data structure, as well as the example below to see how such data is handled.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="serial-data-input"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.data[3].someStrangeValue"\n' +
					'\n' +
					'\t\tsorting={[["data.data[3].someStrangeValue","desc"]]}\n' +
					'\t\txValuesSize={4}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								maxWidth={50}

								key="serial-data-input"
								data={sample_serie_4}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.data[3].someStrangeValue"

								sorting={[["data.data[3].someStrangeValue", "desc"]]}
								xValuesSize={4}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="barColors">Custom bar colors</h2>

				<p>By default, all the bars have the same color (accent color from CSS). However, it is possible to change this color using <InlineCodeHighlighter>defaultColor</InlineCodeHighlighter> property as well as the color for hover using   <InlineCodeHighlighter>highlightedColor</InlineCodeHighlighter> property.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="default-color"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.some_value_1"\n' +
					'\n' +
					'\t\tsorting={[["data.some_value_1","desc"]]}\n' +
					'\n' +
					'\t\tdefaultColor="#ffaaaa"\n' +
					'\t\thighlightedColor="#ff0000"\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="default-color"
								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"

								sorting={[["data.some_value_1", "desc"]]}

								defaultColor="#ffaaaa"
								highlightedColor="#ff0000"
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<p>In some cases, it will be useful if every column has its own color (e.g. for visualizing elections results). There are two options to achieve it. Either use <InlineCodeHighlighter>defaultSchemeBarColors</InlineCodeHighlighter> to assign colors from D3 scheme, or define your own colors in input data. Then use <InlineCodeHighlighter>colorSourcePath</InlineCodeHighlighter> property instead.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="colored"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.some_value_1"\n' +
					'\n' +
					'\t\tsorting={[["data.some_value_1","desc"]]}\n' +
					'\n' +
					'\t\tdefaultSchemeBarColors\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="colored"
								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"

								sorting={[["data.some_value_1", "desc"]]}

								defaultSchemeBarColors
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="aggregation">Aggregation</h2>

				<p>There are two options how to involve bars aggregation. First of them is <InlineCodeHighlighter>minBarWidth</InlineCodeHighlighter> which defines minimal width of bar in pixels. </p><p>The other one is <InlineCodeHighlighter>barGapRatio</InlineCodeHighlighter> which is the ratio between the bar width and the width of the gap next to the bar. Please notice that there are two gaps for each bar, one on the left and one on the right. So the ratio 0.5 actually means that the gap between two bars will have the same width as the bar itself.</p>
				<p>Try to resize to see how <InlineCodeHighlighter>minBarWidth</InlineCodeHighlighter> and <InlineCodeHighlighter>barGapRatio</InlineCodeHighlighter> involve aggregation.</p>

				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="aggregation"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.some_value_1"\n' +
					'\n' +
					'\t\tsorting={[["data.some_value_1","desc"]]}\n' +
					'\t\txValuesSize={5}\n' +
					'\n' +
					'\t\tminBarWidth={15}\n' +
					'\t\tbarGapRatio={0.5}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="aggregation"
								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"

								sorting={[["data.some_value_1", "desc"]]}
								xValuesSize={5}

								minBarWidth={15}
								barGapRatio={0.5}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

				<p>If number of items in data is too big the bars are aggregated as well. We use 200 items in the example below. The narrower is the chart, the more items are aggregated into one bar. Hover the chart to see the bars.</p>

				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="aggregation-200"
								data={sample_200}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_1"

								sorting={[["data.some_value_1", "desc"]]}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="diverging">Diverging bars</h2>
				<p>Use <InlineCodeHighlighter>diverging</InlineCodeHighlighter> prop if the values are diverging from some point (typically positive and negative values). The point of diversion can be set via <InlineCodeHighlighter>yOptions</InlineCodeHighlighter>. All the bars representing values greater than the <InlineCodeHighlighter>diversionValue</InlineCodeHighlighter> will be rendered upwards and vice versa.</p>

				<SyntaxHighlighter language="jsx">
					{'// Sorting is not required, but recommended, especially for aggregated bars. \n' +
					'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="diverging-bars"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath="data.some_value_2"\n' +
					'\n' +
					'\t\tsorting={[["data.some_value_2","desc"]]}\n' +
					'\n' +
					'\t\tdiverging\n' +
					'\t\txGridlines\n' +
					'\t\tyOptions={{\n' +
					'\t\t\tdiversionValue: 0\n' +
					'\t\t}}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="diverging-chart"
								data={sample_15}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath="data.some_value_2"

								sorting={[["data.some_value_2", "desc"]]}

								minBarWidth={4}
								diverging
								xGridlines
								yOptions={{
									diversionValue: 0
								}}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>


				<p>Set <InlineCodeHighlighter>diverging='double'</InlineCodeHighlighter> if you want to render bars both upwards and downwards for the same item. In this case, <InlineCodeHighlighter>ySourcePath</InlineCodeHighlighter> must be an array containing paths to both values.</p>
				<SyntaxHighlighter language="jsx">
					{'// Sorting is not required, but recommended, especially for aggregated bars. \n' +
					'<HoverHandler>\n' +
					'\t<ColumnChart \n' +
					'\t\tkey="diverging-bars"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\txSourcePath="data.name"\n' +
					'\t\tySourcePath={["data.positive","data.negative"]}\n' +
					'\n' +
					'\t\tdiverging="double"\n' +
					'\t\txGridlines\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<ColumnChart
								key="diverging-chart"
								data={diverging_stacked}
								keySourcePath="key"
								nameSourcePath="data.name"
								xSourcePath="data.name"
								ySourcePath={["data.positive", "data.negative"]}

								diverging="double"
								xGridlines
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

			</Page>
		);
	}
}

export default withNamespaces()(ColumnChartDoc);
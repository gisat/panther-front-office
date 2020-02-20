import React from 'react';
import {Link} from "react-router-dom";

import {AsterChart} from "@gisatcz/ptr-charts";
import {HoverHandler} from "@gisatcz/ptr-core";
import Page, {DocsToDo, DocsToDoInline, InlineCodeHighlighter, LightDarkBlock, SyntaxHighlighter} from "../../../Page";
import ResizableContainer from "../../../ResizableContainer/ResizableContainer";
import ComponentPropsTable from "../../../ComponentPropsTable/ComponentPropsTable";

import sample_4 from "../../../mockData/asterChart/sample_4";
import sample_7 from "../../../mockData/asterChart/sample_7";
import sample_30 from "../../../mockData/asterChart/sample_30";

class AsterChartDoc extends React.PureComponent {
	render() {
		return (
			<Page title="Aster chart">
				<div className="ptr-docs-visualizations-intro-example" style={{maxWidth: '20rem'}}>
					<HoverHandler>
						<AsterChart
							key="typical-example"
							data={sample_7}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"

							width={20}
						/>
					</HoverHandler>
				</div>

				<p>An aster chart is a type of chart using arcs to show the distribution of values by the depth of the arc. All arcs have the same angle. Use this type of chart to <b>show distribution of one attribute for multiple cases</b> or to compare attribute values (which are comparable - relative or with the same units) for one area.</p>


				<h2 id="props">Props</h2>
				<ComponentPropsTable
					content={[
						{
							name: "data",
							type: "string",
							required: true,
							description: (<>Input data. See more in <Link to="#dataValues">Data structure section</Link>.</>)
						}, {
							name: "forceMinimum",
							type: "number",
							description: (<>Set fixed minimum. See more in <Link to="#forceMinMax">Forced minimum and maximum section</Link>.</>)
						}, {
							name: "forceMaximum",
							type: "number",
							description: (<>Set fixed maximum. See more in <Link to="#forceMinMax">Forced minimum and maximum section</Link>.</>)
						}, {
							name: "relative",
							type: "boolean",
							default: "false",
							description: (<>Detect if input data are relative. <Link to="#relativeValues">See Relative values section</Link> to find out more.</>)
					}, {
							name: "sorting",
							type: "array",
							description: "List of sorting pairs. [[path, order]]. Example: [['period', 'asc']] - it sorts data by 'period' column in ascending order."
						}, {}, {
							name: "keySourcePath",
							type: "string",
							required: true,
							description: "Path to key value in data item object (e.g. 'key' or 'data.key')."
						}, {
							name: "nameSourcePath",
							type: "string",
							required: true,
							description: "Path to name value in data item object (e.g. 'name' or 'content.name'). If there is no name column in data, use the path to the key."
						}, {
							name: "colorSourcePath",
							type: "string",
							description: "Path to color value in data item object, if it's present."
						}, {
							name: "valueSourcePath",
							type: "string",
							required: true,
							description: "Path to value in data item object."
						}, {
							name: "hoverValueSourcePath",
							type: "string",
							description: <>Path to text to be shown on hover. If undefined, then value (from 'valueSourcePath') is shown instead. See <Link to="/docs/components/visualizations/asterChart#customHover">Custom Hover section</Link>.</> 
						}, {}, {
							name: "width",
							type: "number",
							description: "Chart width in rem."
						}, {
							name: "maxWidth",
							type: "number",
							default: "30",
							description: "Maximal chart width in rem."
						}, {
							name: "minWidth",
							type: "number",
							default: "10",
							description: "Minimal chart width in rem."
						}, {
							name: "padding",
							type: "number",
							default: "1",
							description: "Chart area padding in rem."
						}, {}, {
							name: "grid",
							type: "boolean",
							default: "true",
							description: "Show/hide circular grid."
						}, {
							name: "gridGapMin",
							type: "number",
							default: "1.5",
							description: <>Minimal gap between grid lines in rem. See more in the <Link to="#grid">Grid section</Link>.</>
						}, {
							name: "gridStepsMax",
							type: "number",
							default: "10",
							description: <>Maximal number of grid lines steps. See more in the <Link to="#grid">Grid section</Link>.</>
						}, {
							name: "gridValues",
							type: "boolean",
							default: "true",
							description: "Labels of grid lines."
						}, {}, {
							name: "radials",
							type: "boolean",
							default: "true",
							description: <>Radial lines from center of the chart to the edge. There is one radial line for each segment. See more in the <Link to="#radials">Radials & legend section</Link>.</>
						}, {
							name: "radialsLabels",
							type: "boolean",
							default: "false",
							description: <>If true, each radial will be numbered clockwise starting from 1.</>
						}, {
							name: "radialsLabelsSize",
							type: "number",
							default: "1",
							description: "A space for radials labels in rem."
						}, {}, {
							name: "startingAngle",
							type: "numeric",
							default: "\u03C0" + "/2",
							description: <>The angle in radians where the rendering of segments starts. the angle is based on <a href="https://en.wikipedia.org/wiki/Unit_circle" target="_blank">unit circle</a>.</>
						}, {}, {
							name: "legend",
							type: "boolean",
							default: "false",
							description: <>Show legend below chart. See more in the <Link to="#radials">Radials & legend section</Link>.</>
						}
					]}
				/>

				<h2 id="dataStructure">Input data structure</h2>
				<p>Input data for the aster chart has to be a collection, where each object (or its children) must contain at least three key-value pairs, one as a source for key, second as a source for name and third as a source for value.</p>
				<SyntaxHighlighter language="javascript">
					{'const data = [\n' +
					'\t{\n' +
					'\t\tkey: "230bd221-5384-4c09-bfa3-069eacbcfff8",   //use \'key\' as keySourcePath\n' +
					'\t\tdata: {\n' +
					'\t\t\tname: "Missouri",   //use \'data.name\' as nameSourcePath\n' +
					'\t\t\ttemperature: "12.56",   //use \'data.temperature\' as valueSourcePath\n' +
					'\t\t\tcolor: "#ff0000",   //use \'data.color\' as colorSourcePath (if present)\n' +
					'\t\t} \n' +
					'\t}, {\n' +
					'\t\tkey: "91c6851e-c5ef-4165-9b15-8cd987a92904",\n' +
					'\t\tdata: {...}\n'	+
					'\t},\n' +
					'\t...\n' +
					']'}
				</SyntaxHighlighter>



				<h2 id="basicSettings">Basic settings</h2>
				<SyntaxHighlighter language="jsx">
					{'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'<HoverHandler>\n' +
					'\t<AsterChart \n' +
					'\t\tkey="basic-settings"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tcolorSourcePath="color"\n' +
					'\t\tvalueSourcePath="data.someStrangeValue"\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<AsterChart
								key="relative-values"
								data={sample_7}

								keySourcePath="key"
								colorSourcePath="color"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="relativeValues">Relative values</h2>
				<p>Input data values may be either absolute or relative. By default, the values are expected to be absolute. Use <InlineCodeHighlighter>relative</InlineCodeHighlighter> property if values are relative. In that case, the % symbol is added to labels and a range is automatically set form 0 to 100.</p>
				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<AsterChart \n' +
					'\t\tkey="relative-values"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tcolorSourcePath="color"\n' +
					'\t\tvalueSourcePath="data.someStrangeValue"\n' +
					'\n' +
					'\t\trelative\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<AsterChart
								key="relative-values"
								data={sample_30}

								keySourcePath="key"
								colorSourcePath="color"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"

								relative
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="dimensions">Dimensions</h2>
				<p>By default, minimal width of the chart is set to 10 rem, maximal width to 30 rem and padding to 1 rem. You can change these values using <InlineCodeHighlighter>minWidth</InlineCodeHighlighter>, <InlineCodeHighlighter>maxWidth</InlineCodeHighlighter> and <InlineCodeHighlighter>padding</InlineCodeHighlighter> prop. Try to resize the charts in the examples above and bellow to see the difference.</p>
				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<AsterChart \n' +
					'\t\tkey="relative-values"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tcolorSourcePath="color"\n' +
					'\t\tvalueSourcePath="data.someStrangeValue"\n' +
					'\n' +
					'\t\tpadding={3}\n' +
					'\t\tmaxWidth={50}\n' +
					'\t\tminWidth={25}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer
							maxWidth={50}
							minWidth={25}
						>
							<AsterChart
								key="relative-values"
								data={sample_7}

								keySourcePath="key"
								colorSourcePath="color"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"

								padding={3}
								maxWidth={50}
								minWidth={25}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="forceMinMax">Forced min & max</h2>
				<p>If we have a knowledge of the data, it is possible to set minimal and maximal value according to our needs using <InlineCodeHighlighter>forceMinimum</InlineCodeHighlighter> and <InlineCodeHighlighter>forceMaximum</InlineCodeHighlighter> prop. However, try to avoid using <InlineCodeHighlighter>forceMinimum</InlineCodeHighlighter> if there are positive values only in the data. It will have negative impact on readability, because we expect that the scale starts on 0, not 300, as you can see in the example below.</p>
				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<AsterChart \n' +
					'\t\tkey="force-min-max"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tcolorSourcePath="color"\n' +
					'\t\tvalueSourcePath="data.someStrangeValue"\n' +
					'\n' +
					'\t\tforceMin={300}\n' +
					'\t\tforceMax={1500}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<AsterChart
								key="forceMinMac"
								data={sample_7}

								keySourcePath="key"
								colorSourcePath="color"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"

								forceMinimum={300}
								forceMaximum={1500}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>




				<h2 id="grid">Grid</h2>
				<p>The grid is shown by default. To hide it set the <InlineCodeHighlighter>grid</InlineCodeHighlighter> property to false. The grid consists of at most 10 equidistant circles (depending on chart size) which are at least 1.5 rem apart. In the example below we set our own maximal number of circles and minimal distance using <InlineCodeHighlighter>gridStepsMax</InlineCodeHighlighter> and <InlineCodeHighlighter>gridGapMin</InlineCodeHighlighter> props. Additionally, it is possible to hide the grid values setting <InlineCodeHighlighter>gridValues</InlineCodeHighlighter> property to false.</p>
					<p>Resize the chart to see how the settings and chart size affects the grid.</p>
				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<AsterChart \n' +
					'\t\tkey="grid"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tcolorSourcePath="color"\n' +
					'\t\tvalueSourcePath="data.someStrangeValue"\n' +
					'\n' +
					'\t\trelative\n' +
					'\n' +
					'\t\tgridGapMin={3}\n' +
					'\t\tgridStepsMax={5}\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<AsterChart
								key="grid"
								data={sample_30}

								keySourcePath="key"
								colorSourcePath="color"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"

								relative

								gridGapMin={3}
								gridStepsMax={5}
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>





				<h2 id="radials">Radials & legend</h2>
				<p>The radials are radial lines from center of the chart to its edge. There is one radial line for each segment and they are shown by default. To hide them set <InlineCodeHighlighter>radials</InlineCodeHighlighter> property to false.</p>
				<p>If there is a big number of segments it is useful to switch on <InlineCodeHighlighter>radialsLabels</InlineCodeHighlighter> like in the example below to make orientation in the chart easier. It will assign the numbers clockwise starting from 1 to radials.</p>
				<p>Another component which will make orientation in the chart easier is the legend. Use the <InlineCodeHighlighter>legend</InlineCodeHighlighter> property to show the legend below chart. If the <InlineCodeHighlighter>radialsLabels</InlineCodeHighlighter> are switched on, the legend will contain these labels as well.</p>
				<SyntaxHighlighter language="jsx">
					{'<HoverHandler>\n' +
					'\t<AsterChart \n' +
					'\t\tkey="radials"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tcolorSourcePath="color"\n' +
					'\t\tvalueSourcePath="data.someStrangeValue"\n' +
					'\n' +
					'\t\tradialsLabels\n' +
					'\n' +
					'\t\tlegend\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<AsterChart
								key="radials"
								data={sample_30}

								keySourcePath="key"
								colorSourcePath="color"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"

								radialsLabels

								legend
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>


				<h2 id="customHover">Custom hover content</h2>
				<p>It's possible to compose custom hover content value. Custom hover value must be included in passed data. Path to value is set in <InlineCodeHighlighter>hoverValueSourcePath</InlineCodeHighlighter> prop.</p>
				<SyntaxHighlighter language="jsx">
					{'// Use HoverHandler to see popups when move cursor over line or point. \n' +
					'<HoverHandler>\n' +
					'\t<AsterChart \n' +
					'\t\tkey="basic-settings"\n' +
					'\t\t\n' +
					'\t\tdata={data}\n' +
					'\t\tkeySourcePath="key"\n' +
					'\t\tnameSourcePath="data.name"\n' +
					'\t\tcolorSourcePath="color"\n' +
					'\t\tvalueSourcePath="data.someStrangeValue"\n' +
					'\t\thoverValueSourcePath="data.hoverValue"\n' +
					'\t/>\n' +
					'</HoverHandler>'}
				</SyntaxHighlighter>
				<LightDarkBlock forceRows>
					<HoverHandler>
						<ResizableContainer>
							<AsterChart
								key="relative-values"
								data={sample_7}

								keySourcePath="key"
								colorSourcePath="color"
								nameSourcePath="data.name"
								valueSourcePath="data.someStrangeValue"
								hoverValueSourcePath="data.hoverValue"
							/>
						</ResizableContainer>
					</HoverHandler>
				</LightDarkBlock>

			</Page>
		);
	}
}

export default AsterChartDoc;

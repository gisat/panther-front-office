import React from 'react';
import {Link} from "react-router-dom";

import AsterChart from "../../../../../../components/common/charts/AsterChart/AsterChart";
import HoverHandler from "../../../../../../components/common/HoverHandler/HoverHandler";
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

				<DocsToDo>Usage</DocsToDo>

				<h2 id="props">Props</h2>
				<ComponentPropsTable
					content={[
						{
							name: "data",
							type: "string",
							required: true,
							description: (<>Input data. <Link to="#dataValues">See Data structure section</Link>.</>)
						}, {
							name: "forceMinimum",
							type: "number",
							description: (<DocsToDoInline>description + link to example</DocsToDoInline>)
						}, {
							name: "forceMaximum",
							type: "number",
							description: (<DocsToDoInline>description + link to example</DocsToDoInline>)
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
							description: <DocsToDoInline>description</DocsToDoInline>
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
							default: "12",
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
							description: <><DocsToDoInline>description + link to example</DocsToDoInline></>
						}, {
							name: "gridGapMin",
							type: "number",
							default: "1.5",
							description: <>Minimal gap between grid lines in rem.<DocsToDoInline>description + link to example</DocsToDoInline></>
						}, {
							name: "gridStepsMax",
							type: "number",
							default: "10",
							description: <>Maximal number of grid lines steps.<DocsToDoInline>description + link to example</DocsToDoInline></>
						}, {
							name: "gridValues",
							type: "boolean",
							default: "true",
							description: <>Grid line values.<DocsToDoInline>description + link to example</DocsToDoInline></>
						}, {}, {
							name: "radials",
							type: "boolean",
							default: "true",
							description: <>Radial lines from center of the chart to the edge. There is one radial line for each segment.<DocsToDoInline>description + link to example</DocsToDoInline></>
						}, {
							name: "radialsLabels",
							type: "boolean",
							default: "false",
							description: <>Each radial will be numbered clockwise starting from 1.</>
						}, {
							name: "radialsLabelsSize",
							type: "number",
							default: "1",
							description: <>A space for radials labels in rem.<DocsToDoInline>description + link to example</DocsToDoInline></>
						}, {}, {
							name: "startingAngle",
							type: "numeric",
							default: "\u03C0" + "/2",
							description: <>The angle in radians where the rendering of segments starts. the angle is based on <a href="https://en.wikipedia.org/wiki/Unit_circle" target="_blank">unit circle</a>.</>
						}, {}, {
							name: "legend",
							type: "boolean",
							default: "false",
							description: <>Show legend below chart.<DocsToDoInline>description + link to example</DocsToDoInline></>
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




				<h2 id="relativeValues">Relative values</h2>
				<p>Input data values may be either absolute or relative. By default, the values are expected to be absolute. Use <InlineCodeHighlighter>relative</InlineCodeHighlighter> property if values are relative. In that case, the % symbol is added to labels and a range is automatically set form 0 to 100.</p>
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




				<h2 id="">Dimensions</h2>
				<h2 id="">Force min & max</h2>
				<h2 id="">Grid</h2>
				<h2 id="">Radials & legend</h2>


				<HoverHandler>
					<ResizableContainer>
						<AsterChart
							key="aster-doc-7"
							data={sample_7}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"
						/>
					</ResizableContainer>
				</HoverHandler>

				<HoverHandler>
					<ResizableContainer>
						<AsterChart
							key="aster-doc-30"
							data={sample_30}

							colorSourcePath="color"
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.someStrangeValue"

							forceMinimum={0}
							forceMaximum={100}

							relative

							radialsLabels

							legend
						/>
					</ResizableContainer>
				</HoverHandler>
					{/*<div className="ptr-docs-panel-section">*/}
						{/*<h2>Basic settings - 4 indicators, random color</h2>*/}
						{/*<p>Max and min from values, no legend.</p>*/}
						{/*<HoverHandler>*/}
							{/*<AsterChart*/}
								{/*key="aster-doc-basic"*/}
								{/*data={sample_4}*/}

								{/*keySourcePath="key"*/}
								{/*nameSourcePath="data.name"*/}
								{/*valueSourcePath="data.someStrangeValue"*/}

								{/*grid*/}
							{/*/>*/}
						{/*</HoverHandler>*/}
					{/*</div>*/}


					{/*<div className="ptr-docs-panel-section">*/}
						{/*<h2>30 indicators, sorted</h2>*/}
						{/*<p>Legend in the bottom, without scale captions</p>*/}
						{/*<HoverHandler>*/}
							{/*<AsterChart*/}
								{/*key="aster-doc-30"*/}
								{/*data={sample_30}*/}

								{/*colorSourcePath="color"*/}
								{/*keySourcePath="key"*/}
								{/*nameSourcePath="data.name"*/}
								{/*valueSourcePath="data.someStrangeValue"*/}
								{/*sorting={[["data.someStrangeValue", "desc"]]}*/}

								{/*forceMinimum={0}*/}
								{/*forceMaximum={100}*/}

								{/*relative*/}

								{/*axis*/}
								{/*grid*/}
								{/*radials={{*/}
									{/*captions: true*/}
								{/*}}*/}

								{/*legend*/}
							{/*/>*/}
						{/*</HoverHandler>*/}
					{/*</div>*/}
			</Page>
		);
	}
}

export default AsterChartDoc;
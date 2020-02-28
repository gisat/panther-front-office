import React from 'react';
import { Link } from '@gisatcz/ptr-state';
import Page, {
	ComponentPropsTable,
	DocsToDo,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from "../../../../Page";
// import serie_10 from "../../../../mockData/scatterChart/serie_10";
import {HoverHandler} from "@gisatcz/ptr-core";
import ReactResizeDetector from 'react-resize-detector';

import Timeline from "../../../../../../../components/common/timeline/";
import PeriodLimit from "../../../../../../../components/common/timeline/periodLimit";
import Overlays from "../../../../../../../components/common/timeline/overlay";
import Picker from "../../../../../../../components/common/timeline/centerPicker";
import Mouse from "../../../../../../../components/common/timeline/mouse";

import period from '../../../../../../../utils/period';
import moment from 'moment';



const overlays = [
	{
		key: 'overlay1',
		start: moment(2018, 'YYYY'),
		end: moment(2020, 'YYYY'),
		backdroundColor: 'rgba(77, 77, 239, 0.7)',
		label: 'label1',
		classes: 'overlay1',
		height: 20,
		top: 0,
	},
	{
		key: 'overlay2',
		start: moment(2019, 'YYYY'),
		end: moment(2035, 'YYYY'),
		backdroundColor: 'rgba(255, 237, 66, 0.7)',
		label: 'label2',
		classes: 'overlay2',
		height: 10,
		top: 0,
	},
	{
		key: 'overlay3',
		start: moment(2005, 'YYYY'),
		end: moment(2018, 'YYYY'),
		backdroundColor: 'rgba(255, 69, 69, 0.7)',
		label: 'label3',
		classes: 'overlay3',
		height: 10,
		top: 20,
	}
]
class TimelineDoc extends React.PureComponent {

	render() {
		const vertical = false;

		return (
			<Page title="Timeline">

				<p>
					Timeline is a container for svg content. User can drill by zoom into small scale or gets an overview of the whole period. Timeline is prepared for vertical or horizontal view.
				</p>

				<p>
					The main idea is, that container has defined period with start and end. Container calculate dayWidth in px as container width (height) / visible period. Passed children content gets dayWidth and visible period in props. DayWidth could be modified by zoom/pinch or programmatically.
				</p>

				<p>
					Timeline can render children in pyramid depends on dayWidth. Every level has max dayWidth value until is visible. While rendering years it does not care about rendering minutes or seconds, it has positive performance aspects. In one moment is visible only one layer of the period.
				</p>

				<h2 id="props">Common props</h2>
				<ComponentPropsTable
					content={
						[
							{
								name: "period",
								type: "object",
								required: true,
								description: "Time bounds for timeline. Move in timeline is restricted by period. If dayWidth or periodLimit not defined, period is set as initial periodLimit.",
								objectPropsDescription: [
									{
										name: "start",
										type: "object",
										description: "momentjs instance"
									},{
										name: "end",
										type: "object",
										description: "momentjs instance"
									}]
							},
							{
								name: "periodLimit",
								type: "object",
								required: false,
								description: "Time bounds for actual view. Must be inside period. PeriodLimit define dayWidth. Used only in constructor. If component gets onMount in props periodLimit and dayWidth, new dayWidth is calculated from periodLimit.",
								objectPropsDescription: [
									{
										name: "start",
										type: "object",
										description: "momentjs instance"
									},{
										name: "end",
										type: "object",
										description: "momentjs instance"
									}]
							},
							{
								name: "dayWidth",
								type: "number",
								required: false,
								description: "Zoom can be modified by dayWidth. DayWidth is xSize of one day in px. If component gets onMount props periodLimit and dayWidth, new dayWidth is calculated from periodLimit.",
							},
							{
								name: "height",
								type: "number",
								required: false,
								default: '45 for horizontal, 70 for vertical',
								description: "Height of content in horizontal view. In vertical view value define width.",
							},
							{
								name: "containerWidth",
								type: "number",
								required: 'in horizontal view',
								description: "Width of parent element.",
							},
							{
								name: "containerHeight",
								type: "number",
								required: 'in vertical view',
								description: "Height of parent element.",
							},
							{
								name: "time",
								type: "object",
								required: true,
								description: "Momentjs instance. Time in center of visible periodLimit.",
							},
							{
								name: "vertical",
								type: "bool",
								required: false,
								default: false,
								description: "Whether display timeline in vertical view.",
							},
							{
								name: "levels",
								type: "array",
								required: false,
								default: '[year/month/day/hour/minute]',
								description: "Definition of layers pyramid. Every level in array is object with 'end' [number] that is maximum dayWidth when level is wisible and 'level' [string] id of level. Levels must be ordered from top to bottom -> small to max dayWidth.",
							},
							{
								name: "onHover",
								type: "function",
								required: false,
								description: "Callback on mouse move over timeline. Used for hoverHandler"
							},
							{
								name: "onClick",
								type: "function",
								required: false,
								description: "Callback on click to timeline."
							},
							{
								name: "onChange",
								type: "function",
								required: false,
								description: "Callback on change timeline state."
							},
							
							{
								name: "periodLimitOnCenter",
								type: "bool",
								required: false,
								default: false,
								description: "Whether limit periodLimit on start/end of element or in center of element."
							},
					]
					}
				/>
					<h2>Examples</h2>
					<h3>Custom children</h3>
					<p>As said, timeline is a container with custom children. Children variously display time, or data, layers even graphs. Custom child is also mouse indicator, periods limitations or center of timeline.</p>
					<p>Overlays, Picker and Mouse are core component, but it is possible to pass custom children.</p>
					<p>Timeline has onChange and onClick listeners that write events into console. Open developer console to see content.</p>
					<SyntaxHighlighter language="jsx">
{
`
const period = {
	start: moment(2010, 'YYYY'),
	end: moment(2025, 'YYYY')
}

const width = 1000;

<Timeline 
	period={period}
	containerWidth={width}
	onChange={(timelineState)=> {console.log("onChange", timelineState)}}
	onClick={(evt) => console.log("onClick", evt)}
	>
		<Picker key="picker"/>
		<Mouse mouseBufferWidth={20} key="mouse"/>
</Timeline>`}
					</SyntaxHighlighter>

					<ReactResizeDetector
						handleWidth
						render={({ width }) => {
							if(width){
								const period = {
									start: moment(2010, 'YYYY'),
									end: moment(2025, 'YYYY')
								}
								return (
										<Timeline 
											period={period}
											containerWidth={width}
											onChange= {(timelineState) => {console.log("onChange", timelineState)}}
											onClick= {(evt) => console.log("onClick", evt)}
											>
												<Picker key="picker"/>
												<Mouse mouseBufferWidth={20} key="mouse"/>
										</Timeline> 
								)
							} else {
								return <div></div>
							}
						}}
						/>
			</Page>
		);
	}
}

export default TimelineDoc;
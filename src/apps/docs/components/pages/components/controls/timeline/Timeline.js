import React from 'react';
import { Link } from '@gisatcz/ptr-state';
import Page, {
	DocsToDo,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from "../../../../Page";
import './timeline.css';
import ComponentPropsTable from "../../../../ComponentPropsTable/ComponentPropsTable";
// import serie_10 from "../../../../mockData/scatterChart/serie_10";

import Timeline from "../../../../../../../components/common/timeline/";
import PeriodLimit from "../../../../../../../components/common/timeline/periodLimit";
import Overlays from "../../../../../../../components/common/timeline/overlay";
import Picker from "../../../../../../../components/common/timeline/centerPicker";
import Mouse from "../../../../../../../components/common/timeline/mouse";
import Years from '../../../../../../../components/common/timeline/years';
import Months from '../../../../../../../components/common/timeline/months';
import Overlay from '../../../../../../../components/common/timeline/overlay';

import TimeLineHover from '../../../../../../../components/common/timeline/TimeLineHover';
import {HoverHandler, getTootlipPosition} from "@gisatcz/ptr-core";

import {getIntersectionOverlays, overlap} from '../../../../../../../components/common/timeline/utils/overlays';
import moment from 'moment';

const TOOLTIP_PADDING = 5;

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
	},
	{
		key: 'overlay4',
		start: moment(2010, 'YYYY'),
		end: moment(2025, 'YYYY'),
		backdroundColor: 'rgba(255, 69, 69, 0.7)',
		label: 'label4',
		classes: 'overlay4',
		height: 10,
		top: 75,
	},
	{
		key: 'overlay5',
		start: '2015-01-01 00:01',
		end: '2015-01-01 00:01',
		backdroundColor: 'rgba(255, 69, 69, 0.7)',
		label: 'label5',
		hideLabel: true,
		classes: 'overlay5',
		height: 5,
		top: 50,
	}
]
const MOUSEBUFFERWIDTH = 10;
class TimelineDoc extends React.PureComponent {
	getHoverContent(x, time) {
		return (
			<div>
				time: {` ${time.format("YYYY MM D H:mm:ss")}`}
			</div>
		)
	}
	getOverlaysHoverContent(x, time, evt) {
		const intersectionOverlays = getIntersectionOverlays(time, overlays, MOUSEBUFFERWIDTH, evt.dayWidth);
		intersectionOverlays.sort((a,b) => a.top - b.top);
		const intersectionOverlaysElms = intersectionOverlays.map(overlay => {
			return <div key={overlay.key} className={'ptr-timeline-tooltip-layer'}>
				<div>
					<span className="dot" style={{'backgroundColor': overlay.backdroundColor}}></span>
				</div>
				<div>{overlay.label}</div>
			</div>
		})
		
		return (
			<div>
				time: {` ${time.format("YYYY MM D H:mm:ss")}`}
				{intersectionOverlaysElms}
			</div>
		)
	}

	onOverlayClick = (overlays) => {
		console.log(overlays);
	}

	getHorizontalTootlipStyle() {
		const referencePoint = 'center';
		
		return () => {
			const windowScrollTop = window.document.documentElement.scrollTop;
			const windowScrollLeft = window.document.documentElement.scrollLeft;
			const windowHeight = window.document.documentElement.clientHeight;
			const windowWidth = window.document.documentElement.clientWidth;
			const windowBBox = [windowScrollTop, windowScrollLeft + windowWidth, windowScrollTop + windowHeight, windowScrollLeft];
			return getTootlipPosition(referencePoint, ['bottom', 'top'], windowBBox, TOOLTIP_PADDING)
		}
	}
	getVerticalTootlipStyle() {
		const referencePoint = 'center';
		
		return () => {
			const windowScrollTop = window.document.documentElement.scrollTop;
			const windowScrollLeft = window.document.documentElement.scrollLeft;
			const windowHeight = window.document.documentElement.clientHeight;
			const windowWidth = window.document.documentElement.clientWidth;
			const windowBBox = [windowScrollTop, windowScrollLeft + windowWidth, windowScrollTop + windowHeight, windowScrollLeft];
			return getTootlipPosition(referencePoint, ['left', 'right'], windowBBox, TOOLTIP_PADDING)
		}
	}

	render() {

		const periodLimit = {
			start: '2010',
			end: '2025'
		}



		const LEVELS=[
			{
				level: 'year',
				end:2
			},
			{
				level: 'month',
				end:20
			}
		];

		const Levels = (props) => {
			const {activeLevel} = props;
			switch (activeLevel) {
				case 'year':
					return React.createElement(Years, {...props, key: 'year'});
				case 'month':
					return React.createElement(Months, {...props, key: 'month'});
			}
			return React.createElement(Months, {...props, key: 'month'});
		};

		return (
			<Page title="Timeline">

				<p>
					Timeline is a container for svg content. User can drill by zoom into small scale or gets an overview of the whole periodLimit. Timeline is prepared for vertical or horizontal view.
				</p>

				<p>
					The main idea is, that container has defined periodLimit with start and end. Container calculate dayWidth in px as container width (height) / visible period. Passed children content gets dayWidth and visible period in props. DayWidth could be modified by zoom/pinch or programmatically.
				</p>

				<h2 id="props">Common props</h2>
				<ComponentPropsTable
					content={
						[
							{
								name: "periodLimit",
								type: "object",
								required: true,
								description: "Time bounds for timeline. Move in timeline is restricted by periodLimit. If dayWidth or periodLimit not defined, periodLimit is set as initial period.",
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
								name: "period",
								type: "object",
								required: false,
								description: "Time bounds for actual view. Must be inside periodLimit. Period defines dayWidth. Used only in constructor. If component gets onMount in props periodLimit and dayWidth, new dayWidth is calculated from periodLimit.",
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
								name: "contentHeight",
								type: "number",
								required: false,
								default: '45 for horizontal, 70 for vertical',
								description: "Height of content in horizontal view. In vertical view value define width.",
							},
							{
								name: "time",
								type: "object",
								required: false,
								description: "Momentjs instance. Time in center of visible periodLimit.",
							},
							{
								name: "vertical",
								type: "bool",
								required: false,
								default: 'false',
								description: "Whether display timeline in vertical view.",
							},
							{
								name: "levels",
								type: "array",
								required: false,
								default: '[year/month/day/hour/minute]',
								description: "Definition of layers pyramid. Every level in array is object with 'end' [number] that is maximum dayWidth when level is visible and 'level' [string] id of level. Levels must be ordered from top to bottom -> small to max dayWidth.",
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
								default: 'false',
								description: "Whether limit periodLimit on start/end of element or in center of element."
							},
							{
								name: "selectMode",
								type: "bool",
								required: false,
								default: 'false',
								description: "If true, zoom follows cursor. If false, zoom to center."
							},
					]
					}
				/>
					<h2>Examples</h2>
					<h3>Custom children</h3>
					<p>As said, timeline is a container with custom children. Children variously display time, or data, layers even graphs. Custom child is also mouse indicator, periods limitations or center of timeline.</p>
					<p>Picker and Mouse are core component, but it is possible to pass custom children.</p>
					<p>Timeline has onChange and onClick listeners that write events into console. Open developer console to see content.</p>
					<SyntaxHighlighter language="jsx">
{
`
const periodLimit = {
	start: '2010',
	end: '2025')
}

const width = 1000;

<Timeline 
	periodLimit={periodLimit}
	onChange={(timelineState)=> {console.log("onChange", timelineState)}}
	onClick={(evt) => console.log("onClick", evt)}
	>
		<Picker key="picker"/>
		<Mouse mouseBufferWidth={20} key="mouse"/>
</Timeline>`}
					</SyntaxHighlighter>
						<Timeline 
							periodLimit={periodLimit}
							onChange= {(timelineState) => {console.log("onChange", timelineState)}}
							onClick= {(evt) => console.log("onClick", evt)}
							>
								<Picker key="picker"/>
								<Mouse mouseBufferWidth={20} key="mouse"/>
						</Timeline> 
					<h3>Layers</h3>
					<p>
						Timeline can render children in pyramid depends on dayWidth. Every level has max dayWidth value until is visible. While rendering years it does not care about rendering minutes or seconds, it has positive performance aspects. In one moment is visible only one layer of the period.
					</p>
					<SyntaxHighlighter language="jsx">
{
`
const LEVELS=[
	{
		level: 'year',
		end:2
	},
	{
		level: 'month',
		end:20
	}
];

const periodLimit = {
	start: '2010',
	end: '2025'
}

const Levels = (props) => {
	const {activeLevel} = props;
	switch (activeLevel) {
		case 'year':
			return React.createElement(Years, {...props, key: 'year'});
		case 'month':
			return React.createElement(Months, {...props, key: 'month'});
	}
	return React.createElement(Months, {...props, key: 'month'});
};

<Timeline 
	periodLimit={periodLimit}
	onChange={(timelineState)=> {console.log("onChange", timelineState)}}
	onClick={(evt) => console.log("onClick", evt)}
	levels={LEVELS}
	>
		<Picker key="picker"/>
		<Mouse mouseBufferWidth={20} key="mouse"/>
		<Levels key="levels"/>
</Timeline> 
`}
					</SyntaxHighlighter>
						<Timeline 
							periodLimit={periodLimit}
							onChange={(timelineState) => {console.log("onChange", timelineState)}}
							onClick={(evt) => console.log("onClick", evt)}
							levels={LEVELS}
							>
								<Picker key="picker"/>
								<Mouse mouseBufferWidth={20} key="mouse"/>
								<Levels key="levels"/>
						</Timeline> 
					<h3>Vertical</h3>
					<p>
						Vertical view is definded by prop <InlineCodeHighlighter>vertical: true</InlineCodeHighlighter>. Timeline children get vertical information in props and they should adapt to vertical.
					</p>
					<SyntaxHighlighter language="jsx">
{
`
const LEVELS=[
	{
		level: 'year',
		end:2
	},
	{
		level: 'month',
		end:20
	}
];
const periodLimit = {
	start: '2010',
	end: '2025'
}
const Levels = (props) => {
	const {activeLevel} = props;
	switch (activeLevel) {
		case 'year':
			return React.createElement(Years, {...props, key: 'year'});
		case 'month':
			return React.createElement(Months, {...props, key: 'month'});
	}
	return React.createElement(Months, {...props, key: 'month'});
};
<Timeline
	periodLimit={periodLimit}
	onChange={(timelineState)=> {console.log("onChange", timelineState)}}
	onClick={(evt) => console.log("onClick", evt)}
	vertical={true}
	levels={LEVELS}
	>
		<Picker key="picker"/>
		<Mouse mouseBufferWidth={20} key="mouse"/>
		<Levels key="levels"/>
</Timeline> 
`}
					</SyntaxHighlighter>

					<div style={{height:'400px',width:'70px'}}>
						<Timeline
							periodLimit={periodLimit}
							onChange={(timelineState) => {console.log("onChange", timelineState)}}
							onClick={(evt) => console.log("onClick", evt)}
							vertical={true}
							levels={LEVELS}
							>
								<Picker key="picker"/>
								<Mouse mouseBufferWidth={20} key="mouse"/>
								<Levels key="levels"/>
						</Timeline> 
					</div>


					<h3>Tooltip</h3>
					<p>
						It's possible to show tooltip for horizontal or vertical view of timeline. Tooltip content is handle by <InlineCodeHighlighter>TimeLineHover</InlineCodeHighlighter>. Position of tooltip is handle by <Link to="/docs/components/iHaveNoIdea/hoverHandler"><InlineCodeHighlighter>HoverHandler</InlineCodeHighlighter></Link>.
					</p>
					<SyntaxHighlighter language="jsx">
{
`
const periodLimit = {
	start: '2010',
	end: '2025'
}

const getHoverContent = (x, time) => {
	return (
		<div>
			'time': time.format("YYYY MM D H:mm:ss")
		</div>
	)
}

const getHorizontalTootlipStyle = () => {
	const referencePoint = 'corner';
	
	return () => {
		const windowScrollTop = window.document.documentElement.scrollTop;
		const windowScrollLeft = window.document.documentElement.scrollLeft;
		const windowHeight = window.document.documentElement.clientHeight;
		const windowWidth = window.document.documentElement.clientWidth;
		const windowBBox = [windowScrollTop, windowScrollLeft + windowWidth, windowScrollTop + windowHeight, windowScrollLeft];
		return getTootlipPosition(referencePoint, ['bottom', 'top'], windowBBox, TOOLTIP_PADDING)
	}
}

<HoverHandler getStyle={getHorizontalTootlipStyle()}>
	<TimeLineHover getHoverContent={getHoverContent}>
		<Timeline
			periodLimit={periodLimit}
			onChange={(timelineState)=> {console.log("onChange", timelineState)}}
			onClick={(evt) => console.log("onClick", evt)}
			vertical={false}
			levels={LEVELS}
			>
				<Picker key="picker"/>
				<Mouse mouseBufferWidth={20} key="mouse"/>
				<Levels key="levels"/>
		</Timeline> 
	</TimeLineHover>
</HoverHandler>
`}
					</SyntaxHighlighter>

					<div>
						<HoverHandler getStyle={this.getHorizontalTootlipStyle()}>
							<TimeLineHover getHoverContent={this.getHoverContent}>
								<Timeline
									periodLimit={periodLimit}
									onChange={(timelineState) => {console.log("onChange", timelineState)}}
									onClick={(evt) => console.log("onClick", evt)}
									vertical={false}
									levels={LEVELS}
									>
										<Picker key="picker"/>
										<Mouse mouseBufferWidth={20} key="mouse"/>
										<Levels key="levels"/>
								</Timeline> 
							</TimeLineHover>
						</HoverHandler>
					</div>

					<h4>
						Tooltip in vertical view
					</h4>
					<p>
						Vertical view with <InlineCodeHighlighter>const referencePoint = 'center';</InlineCodeHighlighter> and position of tooltip in <InlineCodeHighlighter>['left', 'right']</InlineCodeHighlighter>.
					</p>

					<div style={{height:'500px',width:'70px', 'marginTop': '40px'}}>
						<HoverHandler getStyle={this.getVerticalTootlipStyle()}>
							<TimeLineHover getHoverContent={this.getHoverContent}>
								<Timeline
									periodLimit={periodLimit}
									onChange={(timelineState) => {console.log("onChange", timelineState)}}
									onClick={(evt) => console.log("onClick", evt)}
									vertical={true}
									levels={LEVELS}
									// periodLimitOnCenter={true}
									// selectMode={true}
									>
										<Picker key="picker"/>
										<Mouse mouseBufferWidth={20} key="mouse"/>
										<Levels key="levels"/>
								</Timeline> 
							</TimeLineHover>
						</HoverHandler>
					</div>


					<h3>
						Overlays
					</h3>
					<p>
						
					</p>

					<div>
						<HoverHandler getStyle={this.getHorizontalTootlipStyle()}>
							<TimeLineHover getHoverContent={this.getOverlaysHoverContent}>
								<Timeline
									periodLimit={periodLimit}
									onChange={(timelineState) => {console.log("onChange", timelineState)}}
									onClick={(evt) => console.log("onClick", evt)}
									vertical={false}
									levels={LEVELS}
									contentHeight={100}
									selectMode={true}
									>
										<Mouse mouseBufferWidth={MOUSEBUFFERWIDTH} key="mouse"/>
										<Levels key="levels"/>
										<Overlay overlays={overlays} onClick={this.onOverlayClick}/>
								</Timeline> 
							</TimeLineHover>
						</HoverHandler>
					</div>

			</Page>
		);
	}
}

export default TimelineDoc;
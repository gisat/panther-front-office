import React from 'react';
import { Link } from 'react-router-dom';
import Page, {
	DocsToDo,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from "../../../../Page";
import './timeline.css';
import ComponentPropsTable from "../../../../ComponentPropsTable/ComponentPropsTable";
// import serie_10 from "../../../../mockData/scatterChart/serie_10";

import MapTimeline from "../../../../../../../components/common/mapTimeline/";
import PeriodLimit from "../../../../../../../components/common/timeline/periodLimit";
import Overlays from "../../../../../../../components/common/timeline/overlay";
import Picker from "../../../../../../../components/common/timeline/centerPicker";
import Mouse from "../../../../../../../components/common/timeline/mouse";
import Years from '../../../../../../../components/common/timeline/years';
import Months from '../../../../../../../components/common/timeline/months';
import Overlay from '../../../../../../../components/common/timeline/overlay';

import TimeLineHover from '../../../../../../../components/common/timeline/TimeLineHover';
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";
import {getTootlipPosition} from "../../../../../../../components/common/HoverHandler/position";

import {getIntersectionLayers, getIntersectionOverlays, overlap} from '../../../../../../../components/common/timeline/utils/overlays';
import moment from 'moment';

const TOOLTIP_PADDING = 5;

const layers = [
	{
		layerKey: "szdcInsar19_track_totalDisplacement_5b145ea8-d38d-4955-838a-efc3498eb5fb",
		period: {
			start: "2015-06-01",
			end: "2015-08-02"
		},
		color: 'rgba(255, 0, 0, 0.7)',
		active: true,
		title: 'Ortofoto 2016',
		info: 'západ',
		zIndex: 3,
	},
	{
		layerKey: "yyyyy11",
		period: {
			start: "2015-06-01 12:00",
			end: "2015-06-01 12:00"
		},
		color: 'rgba(0, 237, 3, 0.7)',
		active: true,
		title: 'Sentinel',
		info: '2015-06-01 12:00',
		zIndex: 2,
	},
	{
		layerKey: "yyyyy22",
		period: {
			start: "2015-06-01 14:00",
			end: "2015-06-01 14:00"
		},
		color: 'rgba(0, 237, 3, 0.7)',
		active: false,
		title: 'Sentinel',
		info: '2015-06-01 14:00',
		zIndex: 2,
	},
	{
		key: "xxxx33",
		layerKey: "yyyyy33",
		period: {
			start: "2015-08-01 14:00",
			end: "2015-08-01 14:00"
		},
		color: 'rgba(0, 237, 3, 0.7)',
		active: false,
		title: 'Sentinel',
		info: '2015-08-01 14:00',
		zIndex: 2,
	},
	
]
const MOUSEBUFFERWIDTH = 10;
class TimelineDoc extends React.PureComponent {
	getOverlaysHoverContent(x, time, evt) {
		const intersectionOverlays = getIntersectionLayers(time, layers, MOUSEBUFFERWIDTH, evt.dayWidth);
		intersectionOverlays.sort((a,b) => a.top - b.top);

		const merged = intersectionOverlays.reduce((acc, val) => {
			//if accumulator includes value with same title, then rise coumt by one
			const included = acc.find(v => v.title === val.title);
			if(included) {
				included.count = included.count + 1;
				return acc;
			} else {
				val.count = 1;
				return [...acc, val];
			}
		}, [])

		const intersectionOverlaysElms = merged.map(overlay => {
			return <div key={overlay.key} className={'ptr-timeline-tooltip-layer'}>
				<div>
					<span class="dot" style={{'backgroundColor': overlay.color}}></span>
				</div>
				<div>{overlay.title}</div>
				<div>
				{overlay.count !== 1 ? overlay.count : overlay.info}
				</div>
			</div>
		})

		if(merged.length > 0) {
			return (
				<div>
					{/* time: {` ${time.format("YYYY MM D H:mm:ss")}`} */}
					{intersectionOverlaysElms}
				</div>
			)
		} else {
			return null;
		}
		
	}

	onOverlayClick = (layers) => {
		console.log(layers);
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
			<Page title="Map Timeline">

				<p>
					bla bla map
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
							{
								name: "layers",
								type: "Array",
								required: false,
								default: '[]',
								description: "Array of layers displayed in timeline."
							},
					]
					}
				/>
					<h2>Examples</h2>

					<h3>
						Horizontal
					</h3>
					<p>
						
					</p>

					<div>
						<HoverHandler getStyle={this.getHorizontalTootlipStyle()}>
							<TimeLineHover getHoverContent={this.getOverlaysHoverContent}>
								<MapTimeline
									periodLimit={periodLimit}
									onChange={(timelineState) => {console.log("onChange", timelineState)}}
									onClick={(evt) => console.log("onClick", evt)}
									vertical={false}
									levels={LEVELS}
									contentHeight={100}
									selectMode={true}
									layers={layers}
									>
										<Mouse mouseBufferWidth={MOUSEBUFFERWIDTH} key="mouse"/>
										<Levels key="levels"/>
								</MapTimeline> 
							</TimeLineHover>
						</HoverHandler>
					</div>

			</Page>
		);
	}
}

export default TimelineDoc;
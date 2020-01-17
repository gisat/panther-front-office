import React from 'react';
import { Link } from 'react-router-dom';
import Page, {
	DocsToDo,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from "../../../../Page";
import ComponentPropsTable from "../../../../ComponentPropsTable/ComponentPropsTable";
// import serie_10 from "../../../../mockData/scatterChart/serie_10";

import Timeline from "../../../../../../../components/common/timeline/";
import PeriodLimit from "../../../../../../../components/common/timeline/periodLimit";
import Overlays from "../../../../../../../components/common/timeline/overlay";
import Picker from "../../../../../../../components/common/timeline/centerPicker";
import Mouse from "../../../../../../../components/common/timeline/mouse";
import Years from '../../../../../../../components/common/timeline/years';
import Months from '../../../../../../../components/common/timeline/months';

import TimeLineHover from '../../../../../../../components/common/timeline/TimeLineHover';
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";
import {getTootlipPosition} from "../../../../../../../components/common/HoverHandler/position";

import period from '../../../../../../../utils/period';
import moment from 'moment';

const TOOLTIP_PADDING = 5;


class TimelineDoc extends React.PureComponent {
	getHoverContent(x, time) {
		return (
			<div>
				time: {` ${time.format("YYYY MM D H:mm:ss")}`}
			</div>
		)
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

		const period = {
			start: moment(2010, 'YYYY'),
			end: moment(2025, 'YYYY')
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
			<Page title="MapTimeline">

				<p>
					Speciál pro zobrazení vrstev.
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
								description: "Time bounds for actual view. Must be inside period. PeriodLimit defines dayWidth. Used only in constructor. If component gets onMount in props periodLimit and dayWidth, new dayWidth is calculated from periodLimit.",
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
					]
					}
				/>
					<h2>Examples</h2>
					<h3>Layers</h3>
					<p>Vrstvy</p>
					<SyntaxHighlighter language="jsx">
{
`
`}
					</SyntaxHighlighter>
						<Timeline
							period={period}
							onChange= {(timelineState) => {console.log("onChange", timelineState)}}
							onClick= {(evt) => console.log("onClick", evt)}
							>
								<Picker key="picker"/>
								<Mouse mouseBufferWidth={20} key="mouse"/>
								{/* <Layers layers={}/> */}
						</Timeline> 
					<h3>Layers</h3>
					<p>
						Timeline can render children in pyramid depends on dayWidth. Every level has max dayWidth value until is visible. While rendering years it does not care about rendering minutes or seconds, it has positive performance aspects. In one moment is visible only one layer of the period.
					</p>
			</Page>
		);
	}
}

export default TimelineDoc;
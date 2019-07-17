import React from 'react';
import { Link } from 'react-router-dom';
import Page, {
	ComponentPropsTable,
	DocsToDo,
	InlineCodeHighlighter,
	LightDarkBlock,
	SyntaxHighlighter
} from "../../../../Page";
// import serie_10 from "../../../../mockData/scatterChart/serie_10";
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";
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
	constructor(props) {
		super(props);
		this.period = period('2010/2025');
	}

	render() {
		const vertical = false;

		return (
			<Page title="Timeline">
				<div className="ptr-docs-visualizations-intro-example timeline">
				<ReactResizeDetector
                    handleWidth
                    render={({ width, height }) => {
                        
                        if ((vertical && height) || (!vertical && width)) {
                            return (
								<HoverHandler>
									{
										<Timeline 
											period={this.period}
											initialPeriod={this.period}
											selectedDate= {null}
											// onChange= {(timelineState) => {this.onTimelineChange(timelineState)}}
											onChange= {(timelineState) => {console.log(timelineState)}}
											// activeLevel={activeLevel}
											// time={time}
											containerWidth={width}
											containerHeight={height}
											// onClick= {this.onClick}
											onClick= {() => console.log("onClick")}
											containerWidth={width}
											containerHeight={height}
											>
											<PeriodLimit key="periodLimit"/>
											<Overlays overlays={overlays} key="overlays"/>
											<Picker key="picker"/>
											<Mouse mouseBufferWidth={20} key="mouse"/>
										</Timeline> 
									}
								</HoverHandler>
							)
						} else {
							return <div>aaa</div>
						}
					}}
					/>
				</div>
			</Page>
		);
	}
}

export default TimelineDoc;
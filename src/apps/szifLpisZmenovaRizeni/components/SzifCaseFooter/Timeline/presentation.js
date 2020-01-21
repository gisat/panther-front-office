import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import MapTimeline from "../../../../../components/common/mapTimeline/";
import PeriodLimit from "../../../../../components/common/timeline/periodLimit";
import Overlays from "../../../../../components/common/timeline/overlay";
import Picker from "../../../../../components/common/timeline/centerPicker";
import Mouse from "../../../../../components/common/timeline/mouse";
import Years from '../../../../../components/common/timeline/years';
import Months from '../../../../../components/common/timeline/months';
import Overlay from '../../../../../components/common/timeline/overlay';

import TimeLineHover from '../../../../../components/common/timeline/TimeLineHover';
import HoverHandler from "../../../../../components/common/HoverHandler/HoverHandler";
import {getTootlipPosition} from "../../../../../components/common/HoverHandler/position";

import {getIntersectionLayers, getIntersectionOverlays, overlap} from '../../../../../components/common/timeline/utils/overlays';


const TOOLTIP_PADDING = 5;

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


const MOUSEBUFFERWIDTH = 10;
class SzifTimeline extends React.PureComponent {
	static propTypes = {
		layers: PropTypes.array,
		periodLimit: PropTypes.object,
		onLayerClick: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.getOverlaysHoverContent = this.getOverlaysHoverContent.bind(this);
	}

	getOverlaysHoverContent(x, time, evt) {
		const {layers} = this.props;
		const intersectionOverlays = getIntersectionLayers(time, layers, MOUSEBUFFERWIDTH, evt.dayWidth);		
		intersectionOverlays.sort((a,b) => a.top - b.top);

		const intersectionOverlaysElms = intersectionOverlays.map(overlay => {
			const periodCount = overlay.period && overlay.period.length;
			const info = periodCount > 1 ? periodCount : overlay.info || `${overlay.period[0].start} - ${overlay.period[0].end}`;
			return <div key={overlay.layerTemplateKey} className={'ptr-timeline-tooltip-layer'}>
				<div>
					<span className="dot" style={{'backgroundColor': overlay.color}}></span>
				</div>
				<div>{overlay.title}</div>
				<div>
					{info}
				</div>
			</div>
		})

		if(intersectionOverlays.length > 0) {
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
		const {periodLimit, layers, onLayerClick} = this.props;

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
			<div style={{width: '100%'}}>
				<HoverHandler getStyle={this.getHorizontalTootlipStyle()}>
					<TimeLineHover getHoverContent={this.getOverlaysHoverContent}>
						<MapTimeline
							periodLimit={periodLimit}
							onChange={(timelineState) => {console.log("onChange", timelineState)}}
							onClick={(evt) => console.log("onClick", evt)}
							vertical={false}
							levels={LEVELS}
							selectMode={true}
							layers={layers}
							legend={true}
							onLayerClick={onLayerClick}
							>
								<Mouse mouseBufferWidth={MOUSEBUFFERWIDTH} key="mouse"/>
								<Levels key="levels"/>
						</MapTimeline> 
					</TimeLineHover>
				</HoverHandler>
			</div>
		);
	}
}

export default SzifTimeline;

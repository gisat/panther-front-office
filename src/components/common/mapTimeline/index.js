import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {withResizeDetector} from 'react-resize-detector';

import Timeline from '../timeline';
import Overlay from '../timeline/overlay';

const CONTROLS_WIDTH = 0;

export const LEVELS = [
	{
		end: 1,
		level: 'year',
	},
	{
		end: 10,
		level: 'month',
	},
	{
		end: 250,
		level: 'day',
	},
	{
		end: 15000,
		level: 'hour',
	},
	{
		end: 70000,
		level: 'minute',
	}
]

const getOverlaysCfg = (layers) => {
	layers.sort((a, b) => a.zIndex-b.zIndex);

	let lastZIndex = 0;
	let top = 0;
	return layers.map((layerCfg) => {
		if(lastZIndex !== layerCfg.zIndex) {
			lastZIndex = layerCfg.zIndex;
			top = top + 7;
		}

		return {

			key: layerCfg.layerKey,
			start: moment(layerCfg.period.start),
			end: moment(layerCfg.period.end),
			backdroundColor: layerCfg.color,
			label: layerCfg.title,
			hideLabel: true,
			// classes: 'overlay5',
			height: 5,
			top: top,
		}
	})
}

class MapTimeline extends React.PureComponent {

	static propTypes = {
		periodLimit: PropTypes.shape({
			start: PropTypes.string,
			end: PropTypes.string
		}).isRequired,
		period: PropTypes.shape({
			start: PropTypes.string,
			end: PropTypes.string
		}),
		dayWidth: PropTypes.number,
		centerTime: PropTypes.func,
		contentHeight: PropTypes.number,
		width: PropTypes.number,
		height: PropTypes.number,
		
		onHover: PropTypes.func,
		onClick: PropTypes.func,

		periodLimitOnCenter: PropTypes.bool,
		vertical: PropTypes.bool,
		
		levels: PropTypes.arrayOf(PropTypes.shape({
			end: PropTypes.number,
			level: PropTypes.string
		})),										//ordered levels by higher level.end 
		onChange: PropTypes.func,
		onLayerClick: PropTypes.func,
		selectMode: PropTypes.bool,					//whether change time while zoom 
	};

	static defaultProps = {
		dayWidth: 1.5,
		levels: LEVELS,
		onHover: () => {},
		onClick: () => {},
		onLayerClick: () => {},
		width: 100,
		height: 100,
		selectMode: false,
	}

	render() {
		const {levels, periodLimit, onHover, onClick, onChange, vertical, children, periodLimitOnCenter, selectMode, contentHeight, onLayerClick, layers} = this.props;

		const overlays = getOverlaysCfg(layers);
		const childArray = React.Children.toArray(children)
		childArray.push(<Overlay key={'layers'} overlays={overlays} onClick={this.onOverlayClick}/>);

		return (
			<Timeline
				periodLimit={periodLimit}
				periodLimitOnCenter={periodLimitOnCenter}
				onChange={onChange}
				onHover={onHover}
				onClick={onClick}
				vertical={vertical}
				levels={levels}
				contentHeight={contentHeight}
				selectMode={selectMode}
				>
				{childArray}
			</Timeline>
		);

	}

}

export default MapTimeline;

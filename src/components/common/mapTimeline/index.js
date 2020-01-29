import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {withResizeDetector} from 'react-resize-detector';

import Timeline from '../timeline';
import Overlay from '../timeline/overlay';
import MapTimelineLegend from './MapTimelineLegend'
import utils from "../../../utils/utils";
import './style.scss';

const CONTROLS_WIDTH = 0;

const getOverlayCfg = (options) => {
	const otherOptions = options.options || {};
	return {
		key: options.key,
		layerTemplateKey: options.layerTemplateKey,
		start: moment(options.period.start),
		end: moment(options.period.end),
		backdroundColor: options.backdroundColor,
		hideLabel: options.hideLabel,
		height: options.height,
		top: options.top,
		options: {
			...otherOptions
		}
	}
}

const getOverlaysCfg = (layers) => {
	const LINEHEIGHT = 1;
	const ROWHEIGHT = 0.6 //in rem
	let line = 0;
	let PADDING = (LINEHEIGHT - ROWHEIGHT) / 2;
	layers.sort((a, b) => a.zIndex-b.zIndex);

	let lastZIndex = layers[0].zIndex;
	let top = PADDING;
	return layers.reduce((acc, layerCfg) => {
		if(lastZIndex !== layerCfg.zIndex) {
			line = line + 1;
			lastZIndex = layerCfg.zIndex;
			//todo rem
			top = (line * LINEHEIGHT) + PADDING;
		}

		if(layerCfg && layerCfg.period && layerCfg.period.length) {
			const otherOptions = layerCfg.options || {};
			const cfgs = layerCfg.period.map((period, index) => {
				return getOverlayCfg({
					key: `${layerCfg.layerTemplateKey}-${index}`,
					layerTemplateKey: layerCfg.layerTemplateKey,
					period: period,
					backdroundColor: layerCfg.active && otherOptions.activePeriodIndex === index ? layerCfg.activeColor : layerCfg.color,
					hideLabel: true,
					height: ROWHEIGHT * utils.getRemSize(),
					top: top * utils.getRemSize(),
					options: {
						...otherOptions,
						periodIndex: index,
					}
				})
			});
			return [...acc, ...cfgs];
		} else {
			const otherOptions = layerCfg.options || {};
			const cfg = getOverlayCfg({
				key: layerCfg.layerTemplateKey,
				layerTemplateKey: layerCfg.layerTemplateKey,
				period: layerCfg.period,
				backdroundColor: layerCfg.active ? layerCfg.activeColor : layerCfg.color,
				label: layerCfg.title,
				hideLabel: true,
				height: ROWHEIGHT * utils.getRemSize(),
				top: top * utils.getRemSize(),
				options: {
					// classes: 'overlay5',
					...otherOptions,
				}
			})

			return [...acc, cfg]
		}
	}, [])
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
		contentHeight: PropTypes.number, //Default contentHeight is calculated fron layers count
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
		selectMode: PropTypes.bool,					//whether change time while zoom 
		//MapTimeline specific
		onLayerClick: PropTypes.func,
		layers: PropTypes.array,					//which layers display in timeline
		legend: PropTypes.bool,					//Display legend part on left side in horizontal view
	};

	static defaultProps = {
		dayWidth: 1.5,
		onHover: () => {},
		onClick: () => {},
		onLayerClick: () => {},
		width: 100,
		height: 100,
		selectMode: false,
		vertical: false,
	}

	render() {
		const {levels, periodLimit, onHover, onClick, onChange, vertical, children, periodLimitOnCenter, selectMode, contentHeight, onLayerClick, layers, legend} = this.props;

		const overlays = getOverlaysCfg(layers);
		const contentHeightByLayers = (layers.length + 1) * utils.getRemSize();
		const childArray = React.Children.toArray(children)
		childArray.push(<Overlay key={'layers'} overlays={overlays} onClick={onLayerClick}/>);

		return (
			<div className={'ptr-maptimeline'}>
				{
					legend && !vertical ? <MapTimelineLegend layers={layers} /> : null
				}
				<div style={{display: 'flex', flex: '1 1 auto'}}>
					<Timeline
						periodLimit={periodLimit}
						periodLimitOnCenter={periodLimitOnCenter}
						onChange={onChange}
						onHover={onHover}
						onClick={onClick}
						vertical={vertical}
						levels={levels}
						contentHeight={contentHeight || contentHeightByLayers}
						selectMode={selectMode}
						>
						{childArray}
					</Timeline>
				</div>
			</div>
		);

	}

}

export default MapTimeline;
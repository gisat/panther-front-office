import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {withResizeDetector} from 'react-resize-detector';

import Timeline from '../timeline';
import Overlay from '../timeline/overlay';
import MapTimelineLegend from './MapTimelineLegend'
import {utils} from "panther-utils"
import './style.scss';

const CONTROLS_WIDTH = 0;

const getOverlaysCfg = (layers) => {
	const LINEHEIGHT = 1;
	const ROWHEIGHT = 0.6 //in rem
	let PADDING = (LINEHEIGHT - ROWHEIGHT) / 2;
	layers.sort((a, b) => a.zIndex-b.zIndex);

	let lastZIndex = layers[0].zIndex;
	let top = PADDING;
	return layers.reduce((acc, layerCfg) => {
		if(lastZIndex !== layerCfg.zIndex) {
			lastZIndex = layerCfg.zIndex;
			//todo rem
			top = LINEHEIGHT + PADDING;
		}

		if(layerCfg && layerCfg.period && layerCfg.period.length) {
			const cfgs = layerCfg.period.map((period, index) => {
				const cfg = {
					key: `${layerCfg.layerTemplateKey}-${index}`,
					layerTemplateKey: layerCfg.layerTemplateKey,
					periodIndex: index,
					start: moment(period.start),
					end: moment(period.end),
					backdroundColor: layerCfg.active && layerCfg.activePeriodIndex === index ? layerCfg.activeColor : layerCfg.color,
					hideLabel: true,
					// classes: 'overlay5',
					height: ROWHEIGHT * utils.getRemSize(),
					top: top * utils.getRemSize(),
				}
				return cfg
			});
			return [...acc, ...cfgs];
		} else {
			const cfg = {
				key: layerCfg.layerTemplateKey,
				layerTemplateKey: layerCfg.layerTemplateKey,
				start: moment(layerCfg.period.start),
				end: moment(layerCfg.period.end),
				backdroundColor: layerCfg.active ? layerCfg.activeColor : layerCfg.color,
				label: layerCfg.title,
				hideLabel: true,
				// classes: 'overlay5',
				height: ROWHEIGHT * utils.getRemSize(),
				top: top * utils.getRemSize(),
			}

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
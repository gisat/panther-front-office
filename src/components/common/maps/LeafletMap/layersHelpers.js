import L from 'leaflet';
import React from 'react';

import {vectorLayerDefaultFeatureStyle as featureStyle, vectorLayerHighlightedFeatureStyle as highlightedFeatureStyle} from '../constants';
import VectorLayer from "./layers/VectorLayer";
import WmsLayer from "./layers/WmsLayer";
import WmtsLayer from "./layers/WmtsLayer";

function getLayerByType(layer, group) {
	if (layer.type){
		switch (layer.type) {
			case 'wmts':
				return (
					<WmtsLayer
						key={layer.key}
						data={layer}
						group={group}
					/>
				);
			case 'wms':
				return (
					<WmsLayer
						key={layer.key}
						data={layer}
						group={group}
					/>
				);
			case 'vector':
				return (
					<VectorLayer
						key={layer.key}
						data={layer}
						group={group}
					/>
				);
			default:
				return null;
		}
	} else {
		return null
	}
}

export default {
	getLayerByType
}
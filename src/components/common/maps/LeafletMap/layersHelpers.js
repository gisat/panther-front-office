import L from 'leaflet';
import React from 'react';

import {vectorLayerDefaultFeatureStyle as featureStyle, vectorLayerHighlightedFeatureStyle as highlightedFeatureStyle} from '../constants';
import VectorLayer from "./layers/VectorLayer";
import WmsLayer from "./layers/WmsLayer";
import WmtsLayer from "./layers/WmtsLayer";

function getLayerByType(layer, map) {
	if (layer.type){
		switch (layer.type) {
			case 'wmts':
				return (
					<WmtsLayer
						key={layer.key}
						data={layer}
						map={map}
					/>
				);
			case 'wms':
				return (
					<WmsLayer
						key={layer.key}
						data={layer}
						map={map}
					/>
				);
			case 'vector':
				return (
					<VectorLayer
						key={layer.key}
						data={layer}
						map={map}
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
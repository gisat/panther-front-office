import {createSelector} from 'reselect';
import _ from 'lodash';
import Overlays from './Overlays/selectors';
import MapsSelect from '../Maps/selectors';
import Windows from './Windows/selectors';
import {stylePriorityOrder} from '../../constants/VisualsConfig';
// import getLayersTreesConfig from

const getComponents = state => state.components;
const getApplicationStyle = state => state.components.application.style;
const getApplicationStyleActiveKey = state => state.components.application.style.activeKey;
const getLayersTrees = state => state.components.layersTrees;
const getApplicationStyleConfiguration = state => state.components.application.style.configuration;
const getMapsContainer = state => state.components.mapsContainer;
const isAppInIntroMode = state => state.components.application.intro;
const getShare = (state) => state.components.share;
/**
 * Select html class with highest priority
 */
const getApplicationStyleHtmlClass = createSelector(
	[getApplicationStyleConfiguration],
	(configuration) => {
		let classWithHighestPriority = null;
		for (let i = 0; i < stylePriorityOrder.length; i++) {
			let givenConfig = configuration[stylePriorityOrder[i]];
			if (givenConfig && givenConfig.htmlClass) {
				classWithHighestPriority = givenConfig.htmlClass;
				break;
			}
		}
		return classWithHighestPriority;
	}
);

const forAllTreeItems = (layerTree = [], callback) => {
	// if (layerTree && layerTree.items && layerTree.items.length > 0) {
		layerTree.forEach((item) => {
			if(item.type === 'folder') {
				forAllTreeItems(item.items, callback);
			} else {
				callback(item);
			}
		});
	// }
}

const getLayersTreesConfig = createSelector(
	[ 
		getLayersTrees,
		(state, layers, layersTreeKey) => layers,
		(state, mapKey, layersTreeKey) => layersTreeKey,
		(state, layers, layersTreeKey) => layers.length,
	],
	(layersTrees, layers, layersTreeKey) => {
		const layersTree = layersTrees ? layersTrees[layersTreeKey] : [];
		//union layers
		//
		forAllTreeItems(layersTree, (item) => {
			if(item && item.type === 'layerTemplate') {
				const layerInMap = layers.find(l => l.filter.layerTemplateKey.indexOf(item.key) === 0);

				item.visible = !!layerInMap;
				item.layerKey = layerInMap ? layerInMap.data.key : null;
				//set layer name
			}
		})
		return layersTree;
	}
)

export default {
	isAppInIntroMode,
	getApplicationStyle,
	getApplicationStyleActiveKey,
	getApplicationStyleHtmlClass,
	getComponents,
	getLayersTrees,
	getLayersTreesConfig,
	getShare,
	getMapsContainer,
	overlays: Overlays,
	windows: Windows
};
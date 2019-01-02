import {createSelector} from 'reselect';
import _ from 'lodash';
import Overlays from './Overlays/selectors';
import Windows from './Windows/selectors';
import {stylePriorityOrder} from '../../constants/VisualsConfig';

const getComponents = state => state.components;
const getApplicationStyle = state => state.components.application.style;
const getApplicationStyleActiveKey = state => state.components.application.style.activeKey;
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

export default {
	isAppInIntroMode,
	getApplicationStyle,
	getApplicationStyleActiveKey,
	getApplicationStyleHtmlClass,
	getComponents,
	getShare,
	getMapsContainer,
	overlays: Overlays,
	windows: Windows
};
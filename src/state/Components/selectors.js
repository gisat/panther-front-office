import {createSelector} from 'reselect';
import _ from 'lodash';
import Overlays from './Overlays/selectors';
import Windows from './Windows/selectors';
import {stylePriorityOrder} from '../../constants/VisualsConfig';

const getComponents = state => state.components;
const getApplicationStyle = state => state.components.application.style;
const getApplicationStyleActiveKey = state => state.components.application.style.activeKey;
const getApplicationStyleHtmlClasses = state => state.components.application.style.htmlClasses;
const getMapsContainer = state => state.components.mapsContainer;
const isAppInIntroMode = state => state.components.application.intro;

const getApplicationStyleHtmlClass = createSelector(
	[getApplicationStyleHtmlClasses],
	(classes) => {
		let classWithHighestPriority = null;
		for (let i = 0; i < stylePriorityOrder.length; i++) {
			if (classes[stylePriorityOrder[i]]) {
				classWithHighestPriority = classes[stylePriorityOrder[i]];
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
	getMapsContainer,
	overlays: Overlays,
	windows: Windows
};
import {createSelector} from 'reselect';
import _ from 'lodash';
import Overlays from './Overlays/selectors'
import Windows from './Windows/selectors'

const getComponents = state => state.components;
const getMapsContainer = state => state.components.mapsContainer;
const isAppInIntroMode = state => state.components.application.intro;

export default {
	isAppInIntroMode: isAppInIntroMode,
	getComponents: getComponents,
	getMapsContainer: getMapsContainer,
	overlays: Overlays,
	windows: Windows
};
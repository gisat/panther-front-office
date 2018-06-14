import {createSelector} from 'reselect';
import _ from 'lodash';
import Overlays from './Overlays/selectors'
import Windows from './Windows/selectors'

const getComponents = state => state.components;

export default {
	getComponents: getComponents,
	overlays: Overlays,
	windows: Windows
};
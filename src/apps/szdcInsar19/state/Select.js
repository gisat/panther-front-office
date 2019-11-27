import {createSelector} from 'reselect';

import CommonSelect from '../../../state/Select';

let lastAppView = null; //let's call this caching
const szdcInsar19 = {

	getLayers: state => {

		//get active view, abort on same as last time or none
		let activeAppView = CommonSelect.components.get(state, 'szdcInsar19_App', 'activeAppView');
		if (!activeAppView || activeAppView === lastAppView) return null;

		//initialize, load configuration for active view or abort
		let layers;
		let [activeCategory, activeView] = activeAppView.split('.');
		let configuration = CommonSelect.app.getConfiguration(state, activeCategory + '.views.' + activeView);
		if (!configuration) return null;

		//save active view if we got this far
		lastAppView = activeAppView;

		if (activeCategory === "track") {

			let trackAreaTrees = CommonSelect.app.getConfiguration(state, 'track.areaTrees');
			let areaTreesAndLevels = CommonSelect.app.getConfiguration(state, 'areaTreesAndLevels');

			//find active tracks
			let activeTrackKeys = ["a34ed54f-c9ef-429b-a86e-11f1f20c94be"];
			//add a layer for each
			layers = activeTrackKeys.map(activeTrackKey => {
				return {
					key: `szdcInsar19_${activeCategory}_${activeView}_${activeTrackKey}`,
					areaTreeLevelKey: areaTreesAndLevels[activeTrackKey],
					styleKey: configuration.style[areaTreesAndLevels[activeTrackKey]],
					attributeKeys: configuration.attributes || [configuration.attribute]
				};
			});
		}

		// layers = CommonSelect.maps.getLayers(state, layers); // todo fix first

		return layers;

	}

};

export default {
	...CommonSelect,
	specific: {
		szdcInsar19
	}
}
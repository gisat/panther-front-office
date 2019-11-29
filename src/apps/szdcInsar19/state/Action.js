import CommonAction from '../../../state/Action';
import CommonSelect from "../../../state/Select";
const szdcInsar19 = {

	changeAppView: (nextAppView) => (dispatch, getState) => {

		let state = getState();

		//get active view, abort on same
		let activeAppView = CommonSelect.components.get(state, 'szdcInsar19_App', 'activeAppView');
		if (activeAppView === nextAppView) return null;

		//initialize, load configuration for active view or abort
		let layers;
		let [nextCategory, nextView] = nextAppView.split('.');
		let configuration = CommonSelect.app.getConfiguration(state, nextCategory + '.views.' + nextView);
		if (!configuration) return null;

		//save active view if we got this far
		dispatch(CommonAction.components.set('szdcInsar19_App', 'activeAppView', nextAppView));

		if (nextCategory === "track") {

			let trackAreaTrees = CommonSelect.app.getConfiguration(state, 'track.areaTrees');
			let areaTreesAndLevels = CommonSelect.app.getConfiguration(state, 'areaTreesAndLevels');

			//find active tracks
			let activeTrackKeys = ["7987ffde-8a93-4f4d-9cbd-a85eac9747d1"]; //todo

			//add a layer for each
			layers = activeTrackKeys.map(activeTrackKey => {
				return {
					key: `szdcInsar19_${nextCategory}_${nextView}_${activeTrackKey}`,
					areaTreeLevelKey: areaTreesAndLevels[activeTrackKey],
					styleKey: configuration.style[areaTreesAndLevels[activeTrackKey]],
					attributeKeys: configuration.attributes || [configuration.attribute]
				};
			});
		}

		dispatch(CommonAction.maps.setMapLayers('szdcInsar19', layers));

	}

};


export default {
	...CommonAction,
	specific: {
		szdcInsar19
	}
}
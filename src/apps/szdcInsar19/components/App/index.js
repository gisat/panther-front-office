import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		viewSelectOpen: Select.components.get(state, 'szdcInsar19_ViewSelect', 'viewSelectOpen'),
		activeAppView: Select.components.get(state, 'szdcInsar19_App', 'activeAppView'),
		dAttribute: Select.app.getConfiguration(state, 'track.dAttribute'),
		trackViews: Select.app.getConfiguration(state, 'track.views'),
		zoneClassificationViews: Select.app.getConfiguration(state, 'zoneClassification.views'),
		periods: Select.app.getConfiguration(state, 'periods'),
		activePeriod: Select.components.get(state, 'szdcInsar19_App', 'activePeriod') || Select.app.getConfiguration(state, 'basePeriod'),
		basePeriod: Select.app.getConfiguration(state, 'basePeriod'),
		areaTreeKeys: Select.app.getConfiguration(state, 'track.areaTrees'),
		activeTracks: Select.components.get(state, 'szdcInsar19_App', 'activeTracks'),
		customLayers: Select.app.getConfiguration(state, 'customLayers')
		// skoroLayers: Select.specific.szdcInsar19.getLayers(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		openViewSelect: () => {
			dispatch(Action.components.set('szdcInsar19_ViewSelect', 'viewSelectOpen', true));
		},
		closeViewSelect: () => {
			dispatch(Action.components.set('szdcInsar19_ViewSelect', 'viewSelectOpen', false));
		},
		selectAppView: key => {
			// dispatch(Action.components.set('szdcInsar19_App', 'activeAppView', key));
			dispatch(Action.specific.szdcInsar19.changeAppView(key));
			dispatch(Action.components.set('szdcInsar19_ViewSelect', 'viewSelectOpen', false));
		},
		selectTracks: keys => {
			dispatch(Action.components.set('szdcInsar19_App', 'activeTracks', keys));
			dispatch(Action.specific.szdcInsar19.changeAppView());
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
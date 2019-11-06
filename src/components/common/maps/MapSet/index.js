import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation, {Map as map, PresentationMap as presentationMap} from './presentation';

const mapStateToProps = (state, ownProps) => {
	if (ownProps.stateMapSetKey) {
		return {
			maps: Select.maps.getMapSetMapKeys(state, ownProps.stateMapSetKey),
			// view: Select.maps.getMapSetView(state, ownProps.stateMapSetKey),
			// backgroundLayer: Select.maps.getMapSetBackgroundLayer(state, ownProps.stateMapSetKey),
			// layers: Select.maps.getMapSetLayers(state, ownProps.stateMapSetKey),
		}
	} else {
		return {
			// backgroundLayer: Select.maps.getBackgroundLayer(state, ownProps.backgroundLayer),
			// layers: Select.maps.getLayers(state, ownProps.layers)
		}
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	if (ownProps.stateMapSetKey) {
		return {
			// updateView: (update) => {
			// 	dispatch(Action.maps.updateSetView(ownProps.stateMapSetKey, update));
			// },
			// resetHeading: () => {
			// 	dispatch(Action.maps.resetSetViewHeading(ownProps.stateMapSetKey));
			// }
		}
	} else {
		return {

		}
	}
};

export const Map = map;
export const PresentationMap = presentationMap;

export default connect(mapStateToProps, mapDispatchToProps)(presentation);

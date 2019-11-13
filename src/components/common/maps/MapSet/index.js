import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation, {Map as map, PresentationMap as presentationMap} from './presentation';
import utils from "../../../../utils/utils";

const mapStateToProps = (state, ownProps) => {
	if (ownProps.stateMapSetKey) {
		return {
			activeMapKey: Select.maps.getMapSetActiveMapKey(state),
			activeMapView: Select.maps.getMapSetActiveMapView(state, ownProps.stateMapSetKey),
			maps: Select.maps.getMapSetMapKeys(state, ownProps.stateMapSetKey),
			view: Select.maps.getMapSetView(state, ownProps.stateMapSetKey)
		}
	} else {
		return {
			// backgroundLayer: Select.maps.getBackgroundLayer(state, ownProps.backgroundLayer),
			// layers: Select.maps.getLayers(state, ownProps.layers)
		}
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'MapSet_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		if (ownProps.stateMapSetKey) {
			return {
				updateView: (update) => {
					dispatch(Action.maps.updateSetView(ownProps.stateMapSetKey, update));
				},
				// resetHeading: () => {
				// 	dispatch(Action.maps.resetSetViewHeading(ownProps.stateMapSetKey));
				// }
			}
		} else {
			let setKey = ownProps.setKey || componentId;
			return {
				onMount: () => {
					dispatch(Action.maps.use(setKey, ownProps.backgroundLayer, ownProps.layers));
				},

				onUnmount: () => {
					dispatch(Action.maps.useClear(setKey));
				},

				refreshUse: () => {
					dispatch(Action.maps.use(setKey, ownProps.backgroundLayer, ownProps.layers));
				},
			}
		}
	}
};

export const Map = map;
export const PresentationMap = presentationMap;

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);

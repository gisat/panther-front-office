import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import mapHelpers from "../../state/helpers/maps";
import presentation from "../SzifMapWrapper/presentation";

const activeLayersComponentID = 'szifZmenovaRizeni_ActiveLayers';
const borderOverlaysComponentID = 'szifZmenovaRizeni_BorderOverlays';

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.maps.getActiveSetKey(state);
	const mapsKeys = Select.maps.getMapSetMapKeys(state, mapSetKey) || [];
	return {
		removeMapDisabled: mapsKeys.length <= 1,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCloseClick: (mapKey) => {
            dispatch(Action.specific.szifLpisZmenovaRizeni.removeMap(mapKey));
            dispatch(mapHelpers.removeActiveLayersByMapKey(activeLayersComponentID, '', mapKey));
            dispatch(mapHelpers.removeBorderOverlaysByMapKey(borderOverlaysComponentID, '', mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
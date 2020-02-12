import React from 'react';
import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "../SzifMapWrapper/presentation";
import mapHelpers from "../../state/helpers/maps";

const activeLayersComponentID = 'szifZmenovaRizeni_ActiveLayers';
const borderOverlaysComponentID = 'szifZmenovaRizeni_BorderOverlays';

const mapStateToProps = (state, ownProps) => {
    const setKey = Select.maps.getActiveSetKey(state);
	return {setKey}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCloseClick: (setKey, mapKey) => {
            dispatch(Action.specific.szifLpisZmenovaRizeni.removeMap(mapKey));
            dispatch(mapHelpers.removeActiveLayersByMapKey(activeLayersComponentID, '', mapKey));
            dispatch(mapHelpers.removeBorderOverlaysByMapKey(borderOverlaysComponentID, '', mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
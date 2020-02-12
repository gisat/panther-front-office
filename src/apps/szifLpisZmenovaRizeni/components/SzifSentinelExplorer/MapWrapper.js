import React from 'react';
import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import mapHelpers from "../../state/helpers/maps";
import presentation from "../SzifMapWrapper/presentation";

const componentID = 'szifZmenovaRizeni_SentinelExplorer';

const mapStateToProps = (state, ownProps) => {
    const setKey = Select.maps.getActiveSetKey(state);
	return {setKey}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCloseClick: (setKey, mapKey) => {
            dispatch(mapHelpers.removeMapAction(componentID, 'maps', mapKey));
            dispatch(mapHelpers.removeActiveLayersByMapKey(componentID, 'activeLayers', mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
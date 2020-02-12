import React from 'react';
import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import mapHelpers from "../../state/helpers/maps";
import presentation from "../SzifMapWrapper/presentation";

const componentID = 'szifZmenovaRizeni_SentinelExplorer';

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.components.get(state, componentID, 'maps.activeSetKey');
	const mapSet = Select.components.get(state, componentID, `maps.sets.${mapSetKey}`);
	const mapsKeys = mapSet.maps || [];
	return {
		removeMapDisabled: mapsKeys.length <= 1,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCloseClick: (mapKey) => {
            dispatch(mapHelpers.removeMapAction(componentID, 'maps', mapKey));
            dispatch(mapHelpers.removeActiveLayersByMapKey(componentID, 'activeLayers', mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
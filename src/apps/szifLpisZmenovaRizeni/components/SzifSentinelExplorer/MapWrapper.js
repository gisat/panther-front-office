import React from 'react';
import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import mapHelpers from "../../state/helpers/maps";

const componentID = 'szifZmenovaRizeni_SentinelExplorer';

// props.props
// props.classes
// props.label
const presentation = (props) => {
    return (<div className={`szifLpisZmenovaRizeni-map ${props.classes}`} style={props.style}>
        <div className="map-window-tools">
            {/* visible for all */}
            <div title="Remove map" className="close-map-button" onClick={() => props.onCloseClick && props.onCloseClick(props.setKey, props.mapKey)}>
                <i className="close-map-icon">✕</i>
            </div>
            <div className="layer-info-label">
                {props.label}
            </div>
        </div>
        {props.children}
    </div>)
}

const mapStateToProps = (state, ownProps) => {
    const setKey = Select.maps.getActiveSetKey(state);
	return {setKey}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCloseClick: (setKey, mapKey) => {
            dispatch(mapHelpers.removeMapAction(componentID, 'maps', mapKey));
            dispatch(mapHelpers.removeActiveLayersByMapKey(componentID, 'activeLayers', mapKey));
            //remove also activelayers

		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
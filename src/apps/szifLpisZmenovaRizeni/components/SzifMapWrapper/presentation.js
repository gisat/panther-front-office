import React from 'react';

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

export default presentation;
import React from 'react';

// props.props
// props.classes
// props.label
// props.mapKey
// props.removeMapDisabled
const presentation = (props) => {
    
    return (<div className={`szifLpisZmenovaRizeni-map ${props.classes}`} style={props.style}>
        <div className="map-window-tools">
            {/* visible for all */}
            {
                !props.removeMapDisabled ? <div title="Remove map" className="close-map-button" onClick={() => props.onCloseClick && props.onCloseClick(props.mapKey)}>
                    <i className="close-map-icon">✕</i>
                </div> : null
            }
            <div className="layer-info-label">
                {props.label}
            </div>
        </div>
        {props.children}
    </div>)
}

export default presentation;
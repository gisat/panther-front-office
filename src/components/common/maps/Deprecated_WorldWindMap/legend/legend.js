import React from 'react';
export const getPolygonImageByAttribution = (attribution) => {
    const interior = attribution.drawInterior ? attribution.interiorColor.toCssColorString() : [0,0,0,1];
    const outline = attribution.drawOutline ? attribution.outlineColor.toCssColorString() : [0,0,0,1];
    const outlineWidth = attribution.outlineWidth;

    const style = {
        'fill': interior,
        'stroke': outline,
        'strokeWidth': outlineWidth,
    }

    return (<svg>
                <rect height="50" width="80" style={style}/>
            </svg>)
}
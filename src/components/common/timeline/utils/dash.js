import React from 'react';

export const D1 = (props) => {
    const {x, height, vertical} = props;
    const width = 0.7;
    const dHeight = height || '100%';
    return (
        <line
            x1={vertical ? 0 : x + width}
            x2={vertical ? dHeight : x + width}
            y1={vertical ? x + width : 0 }
            y2={vertical ? x + width : dHeight }
            />
    );
}
export const D2 = (props) => {
    const {x, height, vertical} = props;
    const width = 0.7;
    const dHeight = height || '50%';
    return (
        <line
            x1={vertical ? dHeight : x + width}
            x2={vertical ? 0 : x + width}
            y1={vertical ? x + width : 0 }
            y2={vertical ? x + width : dHeight }
            />
    );
}
export const D3 = (props) => {
    const {x, height, vertical} = props;
    const width = 0.7;
    const dHeight = height || '33%';
    return (
        <line
            x1={vertical ? 0 : x + width}
            x2={vertical ? dHeight : x + width}
            y1={vertical ? x + width : 0 }
            y2={vertical ? x + width : dHeight }
            />
    );
}
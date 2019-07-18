import React from 'react';
import PropTypes from 'prop-types';

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

D1.propTypes = {
	x: PropTypes.number.isRequired,
	height: PropTypes.number,
	vertical: PropTypes.bool,
  }

D1.defaultProps = {
	vertical: false,
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


D2.propTypes = {
	x: PropTypes.number.isRequired,
	height: PropTypes.number,
	vertical: PropTypes.bool,
  }

D2.defaultProps = {
	vertical: false,
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

D3.propTypes = {
	x: PropTypes.number.isRequired,
	height: PropTypes.number,
	vertical: PropTypes.bool,
  }

D3.defaultProps = {
	vertical: false,
}
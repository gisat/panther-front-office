import React from 'react';
import PropTypes from 'prop-types';
import {D1, D2, D3} from '../utils/dash';

const HoursDash = (props) => {
	const {x, label, vertical, height} = props;
	return (
		<g
			className={'ptr-timeline-hour'}
		>
			{height === 1 ? <D1 x={x} vertical={vertical}/> : null}
			{height === 2 ? <D2 x={x} vertical={vertical}/> : null}
			{height === 3 ? <D3 x={x} vertical={vertical}/> : null}
			{label}
		</g>
	);
} ;


HoursDash.propTypes = {
	x: PropTypes.number.isRequired,
	label: PropTypes.element,
	vertical: PropTypes.bool,
  }

HoursDash.defaultProps = {
	vertical: false,
	label: null,
}

export default HoursDash;

import React from 'react';
import PropTypes from 'prop-types';
import {D1, D2} from '../utils/dash';

const MonthDash = (props) => {
	const {x, label, vertical, height} = props;
	return (
		<g
			className={'ptr-timeline-month'}
		>
			{height === 2 ? <D2 x={x} vertical={vertical}/> : null}
			{height === 1 ? <D1 x={x} vertical={vertical}/> : null}
			{label}
		</g>
	);
} ;

MonthDash.propTypes = {
	x: PropTypes.number.isRequired,
	label: PropTypes.element,
	vertical: PropTypes.bool,
  }

MonthDash.defaultProps = {
	vertical: false,
	label: null,
}

export default MonthDash;

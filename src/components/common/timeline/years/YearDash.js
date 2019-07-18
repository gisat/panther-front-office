import React from 'react';
import PropTypes from 'prop-types';
import {D1} from '../utils/dash';

const YearsDash = (props) => {
	const {x, label, vertical} = props;
	return (
		<g
			className={'ptr-timeline-year'}
		>
			<D1 x={x} vertical={vertical}/>
			{label}
		</g>
	);
};


YearsDash.propTypes = {
	x: PropTypes.number.isRequired,
	label: PropTypes.element,
	vertical: PropTypes.bool,
  }

YearsDash.defaultProps = {
	vertical: false,
	label: null,
}

export default YearsDash;

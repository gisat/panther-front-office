import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'react-dimensions';
import utils from '../../../../../../utils/utils';
import _ from 'lodash';

import Months from '../../../../../presentation/controls/MapsTimeline/components/Months';

class AuAttributeFrequencyGraph extends React.PureComponent {

	render() {

		let height = 100;
		return (
			<svg
				width={this.props.width}
				height={height}
			>
				<Months
					period={this.props.period}
					getX={this.props.getX}
					height={height}
					dayWidth={this.props.dayWidth}
				/>

			</svg>
		);
	}

}

export default AuAttributeFrequencyGraph;

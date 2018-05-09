import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../../utils/utils';
import _ from 'lodash';

import Months from '../../../../../presentation/controls/MapsTimeline/components/Months';
import Mouse from '../../../../../presentation/controls/MapsTimeline/components/Mouse';

class AuAttributeFrequencyGraph extends React.PureComponent {

	render() {

		let height = 100;
		return (
			<svg
				width={this.props.width}
				height={height}
			>
				<Months
					background
					period={this.props.period}
					getX={this.props.getX}
					height={height}
					dayWidth={this.props.dayWidth}
				/>
				<Mouse
					mouseBufferWidth={this.props.mouseBufferWidth}
					mouseX={this.props.mouseX}
					height={height}
				/>

			</svg>
		);
	}

}

export default AuAttributeFrequencyGraph;

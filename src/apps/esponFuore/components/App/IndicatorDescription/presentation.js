import React from "react";
import PropTypes from 'prop-types';
import './style.scss';

class IndicatorDescription extends React.PureComponent {

	static propTypes = {
		activeIndicator: PropTypes.object
	};

	render() {
		return this.props.activeIndicator ? (
			<div className="esponFuore-indicator-description">
				<p>{this.props.activeIndicator.data.description}</p>
			</div>
		) : null
	}
}

export default IndicatorDescription;

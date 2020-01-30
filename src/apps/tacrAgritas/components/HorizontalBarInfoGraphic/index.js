import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import './style.scss';

class HorizontalBarInfoGraphic extends React.PureComponent {
	static propTypes = {
		name: PropTypes.string,
		unit: PropTypes.string,
		min: PropTypes.number,
		max: PropTypes.number,
		mean: PropTypes.number,
		value: PropTypes.number
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<div className="ptr-hbar-infographic-item">
				<div className="ptr-hbar-infographic-item-name">
					<span className="ptr-hbar-infographic-item-title">{props.name}</span>
					<span className="ptr-hbar-infographic-item-unit">({props.unit})</span>
				</div>
				<div className="ptr-hbar-infographic-item-bar-box">
					<div className="ptr-hbar-infographic-item-bar-rail">
						<div className="ptr-hbar-infographic-item-bar"></div>
					</div>
				</div>
			</div>
		);
	}
}

export default HorizontalBarInfoGraphic;
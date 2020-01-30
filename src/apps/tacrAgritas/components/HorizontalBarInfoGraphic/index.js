import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import './style.scss';
import Fade from "react-reveal/Fade";

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

		this.state = {
			barWidth: 0,
			meanLeft: 0
		}
	}

	componentDidMount(prevProps, prevState, snapshot) {
		this.update();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.update();
	}

	update() {
		const props = this.props;
		if ((props.min || props.min === 0) && (props.max || props.max === 0)) {
			const fullWidth = props.max - props.min;
			const meanLeft = props.mean - props.min;
			const barWidth = props.value - props.min;
			this.setState({
				barWidth: `${(barWidth/fullWidth) * 100}%`,
				meanLeft: `${(meanLeft/fullWidth) * 100}%`
			});
		}
	}

	render() {
		const props = this.props;

		return (
			<div className="ptr-hbar-infographic-item">
				<div className="ptr-hbar-infographic-top">
					<div className="ptr-hbar-infographic-name">
						<div className="ptr-hbar-infographic-title">{props.name}</div>
					</div>
					<div className="ptr-hbar-infographic-value">
						{props.value}
					</div>
				</div>
				<div className="ptr-hbar-infographic-bar-box">
					<div className="ptr-hbar-infographic-bar-rail">
						<div className="ptr-hbar-infographic-bar" style={{width: this.state.barWidth}}></div>
						<div title={"Medián: " + props.mean} className="ptr-hbar-infographic-mean" style={{left: this.state.meanLeft}}></div>
					</div>
				</div>
				<div className="ptr-hbar-infographic-bottom">
					<div className="ptr-hbar-infographic-min">{props.min} {props.unit}</div>
					<div className="ptr-hbar-infographic-max">{props.max} {props.unit}</div>
				</div>
			</div>
		);
	}
}

export default HorizontalBarInfoGraphic;
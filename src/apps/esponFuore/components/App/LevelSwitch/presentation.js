import React from "react";
import PropTypes from 'prop-types';
import Button from "../../../../../components/common/atoms/Button";
import "./style.scss";

const levelToSwitch = {
	2: {
		level: 1,
		label: "country level"
	},
	1: {
		level: 2,
		label: "regional level"
	}
};

class LevelSwitch extends React.PureComponent {
	static propTypes = {
		activeLevel: PropTypes.number
	};

	constructor(props) {
		super(props);

		this.onChangeLevelClick = this.onChangeLevelClick.bind(this);
	}

	onChangeLevelClick() {
		this.props.switchLevel(levelToSwitch[this.props.activeLevel].level);
	}

	render() {
		return (
			<div className="esponFuore-level-switch">
				<Button onClick={this.onChangeLevelClick}>{`Switch to ${levelToSwitch[this.props.activeLevel].label}`}</Button>
			</div>
		);
	}
}

export default LevelSwitch;

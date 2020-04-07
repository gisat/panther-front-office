import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import Button from "../../../../../components/common/atoms/Button";
import ButtonSwitch, {Option} from "../../../../../components/common/atoms/ButtonSwitch";
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

	render() {
		return (
			<div className="esponFuore-level-switch">
				<ButtonSwitch onClick={this.props.switchLevel} ghost>
					{_.map(levelToSwitch, level  => (
						<Option active={this.props.activeLevel === level.level} value={level.level}>{level.label}</Option>
					))}
				</ButtonSwitch>
			</div>
		);
	}
}

export default LevelSwitch;

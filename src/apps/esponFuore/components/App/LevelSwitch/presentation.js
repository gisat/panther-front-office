import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from "classnames";
import ButtonSwitch, {Option} from "../../../../../components/common/atoms/ButtonSwitch";
import "./style.scss";
import {indicatorLevelDataNaming, levelToSwitch} from "../../../constants/appConstants";

class LevelSwitch extends React.PureComponent {
	static propTypes = {
		activeLevel: PropTypes.number,
		activeIndicator: PropTypes.object
	};

	render() {
		const indicatorData = this.props.activeIndicator && this.props.activeIndicator.data && this.props.activeIndicator.data.other;

		return (
			<div className="esponFuore-level-switch">
				<span>Use</span>
				<ButtonSwitch onClick={this.props.switchLevel} ghost small>
					{_.map(levelToSwitch, (level, i)  => {
						const hasData = indicatorData && indicatorData[indicatorLevelDataNaming[level.level]];
						return <Option key={i} disabled={!hasData} active={this.props.activeLevel === level.level} value={level.level}>{level.label}</Option>
					})}
				</ButtonSwitch>
				<span>units</span>
			</div>
		);
	}
}

export default LevelSwitch;

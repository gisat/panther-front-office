import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import React from "react";
import classnames from 'classnames';

const mapStateToProps = (state, ownProps) => {
	return {
		disabled: Select.specific.szdcInsar19.getActiveViewConfigurationPeriod(state) === 1400
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		selectPeriod: key => {
			dispatch(Action.components.set('szdcInsar19_App', 'activePeriod', key));
			dispatch(Action.specific.szdcInsar19.changeAppView());
			dispatch(Action.periods.setActiveKey(key));
		},
		onMount: () => {
			dispatch(Action.periods.useKeys(ownProps.periodKeys, 'szdcInsar19_PeriodSelect'));
			dispatch(Action.periods.setActiveKey(ownProps.activePeriodKey));
		},
		onUnmount: () => {
			dispatch(Action.periods.useKeysClear('szdcInsar19_PeriodSelect'));
		}
	}
};

class PeriodSelect extends React.PureComponent {

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {

		let props = this.props;
		let classes = classnames("szdcInsar19-period-select", {
			disabled: this.props.disabled
		});

		if (props.periods && props.activePeriodKey) {
			return (
				<div className={classes}>
					Posledních {_.map(props.periods, (uuid, days) => (
					<label key={uuid}>
						<input
							disabled={this.props.disabled}
							type="radio"
							name="period"
							value={days}
							onClick={props.selectPeriod.bind(this, uuid)}
							checked={props.activePeriodKey === uuid}
							readOnly
						/>
						{days}
					</label>
				))} dní
				</div>
			);

		}

		return null;

	};

}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodSelect);
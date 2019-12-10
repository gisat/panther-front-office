import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import React from "react";

const mapStateToProps = (state, ownProps) => {
	return {

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
			dispatch(Action.periods.useKeys(ownProps.periodKeys, 'szdcInsar19_TrackSelect'));
			dispatch(Action.periods.setActiveKey(ownProps.activePeriodKey));
		},
		onUnmount: () => {
			dispatch(Action.periods.useKeysClear('szdcInsar19_TrackSelect'));
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

		if (props.periods && props.activePeriodKey) {
			return (
				<div className="szdcInsar19-period-select">
					Posledních {_.map(props.periods, (uuid, days) => (
					<label>
						<input
							type="radio"
							name="period"
							value={days}
							onClick={props.selectPeriod.bind(this, uuid)}
							checked={props.activePeriodKey === uuid}
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
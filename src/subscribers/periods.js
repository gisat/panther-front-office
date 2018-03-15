import {connect} from 'redux-haiku';
import Action from '../state/Action';
import utils from '../utils/utils';

const mapStateToProps = (state, prevState) => {
	const getPeriods = (state) =>
		state &&
		state.periods &&
		state.periods.data;

	return {
		data: getPeriods(state)
	}
};

const mapDispatchToProps = (dispatch) => ({
	addPeriods: (periods) => {
		dispatch(Action.periods.add(periods));
	},
});

// ===============================================
let listenersRegistered = false;

const registerListeners = (props) => {
	if (!listenersRegistered) {
		window.Stores.addListener((event, options) => {
			if (event === 'PERIODS_LOADED') {
				props.addPeriods(utils.replaceIdWithKey(options));
			}
		});
		listenersRegistered = true;
	}
};

const periodsSubscriber = (props) => {
	registerListeners(props);
};


export default connect(mapStateToProps, mapDispatchToProps)(periodsSubscriber)
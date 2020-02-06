import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import datesHelpers from "../../state/helpers/dates";
import presentation from "./presentation";

const componentID = 'szifZmenovaRizeni_SentinelExplorer';

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.components.get(state, componentID, 'maps.activeSetKey');
	const mapSet = Select.components.get(state, componentID, `maps.sets.${mapSetKey}`);
	return {
		//datesLoading
		//getDatesActive
		mapSet
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		loadSentinels: (mapSet) => {
			datesHelpers.ensureDatesForMapSetExtent(mapSet).then((results) => {
				dispatch(Action.components.set(componentID, `dates`, results));
			});
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import datesHelpers from "../../state/helpers/dates";
import presentation from "./presentation";

const componentID = 'szifZmenovaRizeni_SentinelExplorer';

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.components.get(state, componentID, 'maps.activeSetKey');
	const mapSet = Select.components.get(state, componentID, `maps.sets.${mapSetKey}`);
	const range = mapSet.data.view.boxRange;
	const getDatesUrl = Select.app.getLocalConfiguration(state, 'getDatesUrl');
	return {
		//datesLoading
		//getDatesActive
		mapSet,
		getDatesUrl,
		getDatesActive: range < 50000, //getDates active in boxRange less than 50km
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		loadSentinels: (mapSet, getDatesUrl) => {
			datesHelpers.ensureDatesForMapSetExtent(mapSet, getDatesUrl).then((results) => {
				dispatch(Action.components.set(componentID, `dates`, results));
			});
		},
		setMapSetView: (mapSetKey, center, range) => {
			const view = {
				'center': {lat: center[0], lon: center[1]},
				boxRange: range,
				tilt: 0,
				roll: 0,
				heading: 0,
			}
			dispatch(Action.components.set(componentID, `maps.sets.${mapSetKey}.data.view`, view));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
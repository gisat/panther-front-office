import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import AoiPeriodsSelector from './AoiPeriodsSelector';

const mapStateToProps = state => {
	return {
		activeAoi: Select.aoi.getActiveAoiData(state),
		scope: Select.scopes.getActiveScopeData(state),
		aois: Select.aoi.getAois(state),
		isDromasAdmin: Select.users.isDromasAdmin(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		setActiveAoi: (key) => {
			dispatch(Action.aoi.setActiveKey(key));
		},
		clearLayerPeriods: () => {
			dispatch(Action.maps.clearLayerPeriodsOfAllMaps());
		},
		clearWmsLayers: () => {
			dispatch(Action.maps.clearWmsLayersOfAllMaps());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AoiPeriodsSelector);
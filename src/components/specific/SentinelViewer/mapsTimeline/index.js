import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import Presentation from './presentation';

const mapStateToProps = state => {
	return {
		maps: Select.maps.getMaps(state),
		activeMapKey: Select.maps.getActiveMapKey(state),
		activeLayers: (state => {
			let map = Select.maps.getActiveMap(state);
			return map ? map.wmsLayers : null;
		})(state),
		activeLayerPeriods: (state => {
			let map = Select.maps.getActiveMap(state);
			return map ? map.layerPeriods : null;
		})(state),
		period: Select.periods.getActivePeriod(state),
		scope: Select.scopes.getActiveScopeData(state),
		layers: Select.wmsLayers.getLayersWithLpisCasePeriods(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		clearLayerPeriod: (layerKey, mapKey) => {
			dispatch(Action.maps.clearLayerPeriod(layerKey, mapKey));
		},
		clearWmsLayer: (layerKey, mapKey) => {
			dispatch(Action.maps.clearWmsLayer(layerKey, mapKey));
		},
		initialize: () => {
			dispatch(Action.maps.initialize());
		},
		selectLayerPeriod: (layerKey, period, mapKey) => {
			dispatch(Action.maps.selectLayerPeriod(layerKey, period, mapKey));
		},
		selectWmsLayer: (layerKey, mapKey) => {
			dispatch(Action.maps.selectWmsLayer(layerKey, mapKey));
		},
		setActive: (key) => {
			dispatch(Action.maps.setActive(key));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
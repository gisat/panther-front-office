import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeCaseKey: Select.cases.getActiveKey(state),
		cases: Select.cases.getAll(state),

		layerTemplates: Select.layerTemplates.getAll(state),
		layers: Select.maps.getMapSetLayersStateBySetKey(state, ownProps.mapSetKey)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setActiveCase: (key) => {
			dispatch(Action.cases.setActiveKey(key))
		},
		addLayer: (layerTemplateKey) => {
			// TODO
			// dispatch(Action.maps.addLayerToMapSet(ownProps.mapSetKey, {layerTemplateKey}));
		},
		removeLayer: (layerTemplateKey) => {
			// TODO
			// dispatch(Action.maps.removeLayerFromMapSet(ownProps.mapSetKey, {layerTemplateKey}));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
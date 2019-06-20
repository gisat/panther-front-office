import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';

import presentation from "./presentation";

import viewCfg from "../../../data/districts/view.js";
import spatialRelationsCfg from "../../../data/districts/spatialRelations.js";
import spatialDataSourcesCfg from "../../../data/districts/spatialDataSources.js";
import boundariesSpatialData from "../../../data/districts/boundaries.js";


const mapDispatchToProps = (dispatch, ownProps) => ({
	onMount: () => {
		dispatch(Action.views.add(viewCfg));
		dispatch(Action.views.setActiveKey(ownProps.activeView));
		dispatch(Action.views.apply(ownProps.activeView, Action));
		
		//set layers relations
		dispatch(Action.spatialRelations.add(spatialRelationsCfg));
		dispatch(Action.spatialDataSources.add(spatialDataSourcesCfg));
		dispatch(Action.spatialDataSources.vector.addBatch(boundariesSpatialData, 'spatialDataSourceKey'));
		
		//set charts
		dispatch(Action.charts.setInitial(boundariesSpatialData, 'spatialDataSourceKey'));

		//set selected area
		dispatch(Action.selections.updateActiveSelection('name', ["1"], []));

		const spatialdataindexFilter = {
			spatialDataSourceKey: ownProps.activeSpatialDataSourceKey,
		};

		dispatch(Action.spatialDataSources.vector.addBatchIndex(spatialdataindexFilter, null, [spatialdataindexFilter], 'spatialDataSourceKey'));
	}
})

const mapStateToProps = (state, ownProps) => {
	let props = {};
	
	return props;
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
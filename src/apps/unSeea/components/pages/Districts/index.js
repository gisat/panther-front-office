import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';

import presentation from "../SubApp/presentation";

import viewCfg from "../../../data/districts/view.js";
// import spatialRelationsCfg from "../../../data/districts/spatialRelations.js";
// import spatialDataSourcesCfg from "../../../data/districts/spatialDataSources.js";
// import boundariesSpatialData from "../../../data/districts/boundaries.js";


const mapDispatchToProps = (dispatch, ownProps) => ({
	onMount: () => {
		const spatialRelationsLoader = import(/* webpackChunkName: "unseea_districts_spatialRelationsCfg" */ "../../../data/districts/spatialRelations.js").then(({default: spatialRelationsCfg}) => {
			dispatch(Action.spatialRelations.add(spatialRelationsCfg));
		});
		const spatialDataSourcesLoader = import(/* webpackChunkName: "unseea_districts_spatialDataSourcesCfg" */ "../../../data/districts/spatialDataSources.js").then(({default: spatialDataSourcesCfg}) => {
			dispatch(Action.spatialDataSources.add(spatialDataSourcesCfg));
		});
		const boundariesLoader = import(/* webpackChunkName: "unseea_districts_boundariesSpatialData" */ "../../../data/districts/boundaries.js").then(({default: boundariesSpatialData}) => {
			dispatch(Action.spatialDataSources.vector.addBatch(boundariesSpatialData, 'spatialDataSourceKey'));

			//set charts
			dispatch(Action.charts.setInitial(boundariesSpatialData, 'spatialDataSourceKey'));
		});

		const boundariesGridLoader = import(/* webpackChunkName: "unseea_districts_boundariesGridSpatialData" */ "../../../data/districts/boundaries_grid.js").then(({default: boundariesSpatialData}) => {
			dispatch(Action.spatialDataSources.vector.addBatch(boundariesSpatialData, 'spatialDataSourceKey'));

			//set charts
			dispatch(Action.charts.setInitial(boundariesSpatialData, 'spatialDataSourceKey'));
		});

		Promise.all([spatialRelationsLoader, spatialDataSourcesLoader, boundariesLoader, boundariesGridLoader]).then(datasets => {
			dispatch(Action.views.add(viewCfg));
			dispatch(Action.views.setActiveKey(ownProps.activeView));
			dispatch(Action.views.apply(ownProps.activeView, Action));
			
			//set layers relations
			// dispatch(Action.spatialRelations.add(spatialRelationsCfg));
			// dispatch(Action.spatialDataSources.add(spatialDataSourcesCfg));
			// dispatch(Action.spatialDataSources.vector.addBatch(boundariesSpatialData, 'spatialDataSourceKey'));
			
			//set charts
			// dispatch(Action.charts.setInitial(boundariesSpatialData, 'spatialDataSourceKey'));

			//set selected area
			dispatch(Action.selections.updateActiveSelection('name', ["4"], []));

			dispatch(Action.spatialDataSources.vector.addBatchIndex({spatialDataSourceKey: 'un_seea_boundaries'}, null, [{spatialDataSourceKey: 'un_seea_boundaries'}], 'spatialDataSourceKey'));
			dispatch(Action.spatialDataSources.vector.addBatchIndex({spatialDataSourceKey: 'un_seea_boundaries_grid'}, null, [{spatialDataSourceKey: 'un_seea_boundaries_grid'}], 'spatialDataSourceKey'));
		})
	}
})

const mapStateToProps = (state, ownProps) => {
	let props = {};
	
	return props;
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
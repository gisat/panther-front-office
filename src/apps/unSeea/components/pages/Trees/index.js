import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';

import presentation from "./presentation";

import viewCfg from "../../../data/trees/view.js";
import spatialRalationsCfg from "../../../data/trees/spatialRalations.js";
import spatialDataSourcesCfg from "../../../data/trees/spatialDataSources.js";
// import treesSpatialData from "../../../data/trees/BYMTreeDatabase_min.js";


// const treesSpatialData = {}

const mapDispatchToProps = (dispatch, ownProps) => ({
	onMount: () => {
		// import(/* webpackChunkName: "BYMTreeDatabase_min" */ "../../../data/trees/BYMTreeDatabase_min.js").then((treesSpatialData) => {
		// import(/* webpackChunkName: "BYMTreeDatabase_min" */ "../../../data/trees/BYMTreeDatabase_full.json").then((treesSpatialData) => {
		import(/* webpackChunkName: "BYMTreeDatabase_min" */ "../../../data/trees/BYMTreeDatabase_cut.json").then((treesSpatialData) => {
			const data = {
				spatialDataSourceKey: "un_seea_trees",
				spatialData: treesSpatialData.default
			}
			
			dispatch(Action.views.add(viewCfg));
			dispatch(Action.views.setActiveKey('UN_SEEA_TREES'));
			dispatch(Action.views.apply("UN_SEEA_TREES", Action));
			
			//set layers relations
			dispatch(Action.spatialRelations.add(spatialRalationsCfg));
			dispatch(Action.spatialDataSources.add(spatialDataSourcesCfg));
			dispatch(Action.spatialDataSources.vector.addBatch(data, 'spatialDataSourceKey'));
			
			//set charts
			dispatch(Action.charts.setInitial(data, 'spatialDataSourceKey'));
	
			//set selected area
			dispatch(Action.selections.updateActiveSelection('name', [8867], []));
			// dispatch(Action.selections.updateActiveSelection('name', [26993], []));
	
			const spatialdataindexFilter = {
				"spatialDataSourceKey": "un_seea_trees",
			};
			dispatch(Action.spatialDataSources.vector.addBatchIndex(spatialdataindexFilter, null, [{spatialDataSourceKey: "un_seea_trees"}], 'spatialDataSourceKey'));
		})


	}
})

const mapStateToProps = (state, ownProps) => {
	let props = {};
	
	return props;
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
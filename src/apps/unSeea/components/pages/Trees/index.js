import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';

import presentation from "./presentation";

import viewCfg from "../../../data/trees/view.js";
import spatialRelationsCfg from "../../../data/trees/spatialRelations.js";
import spatialDataSourcesCfg from "../../../data/trees/spatialDataSources.js";


// const treesSpatialData = {}

const mapDispatchToProps = (dispatch, ownProps) => ({
	onMount: () => {
		// import(/* webpackChunkName: "BYMTreeDatabase_min" */ "../../../data/trees/BYMTreeDatabase_min.js").then((treesSpatialData) => {
		// import(/* webpackChunkName: "BYMTreeDatabase_min" */ "../../../data/trees/BYMTreeDatabase_full.json").then((treesSpatialData) => {
		import(/* webpackChunkName: "BYMTreeDatabase_min" */ "../../../data/trees/BYMTreeDatabase_cut_money.json").then((treesSpatialData) => {
			const data = {
				spatialDataSourceKey: ownProps.activeSpatialDataSourceKey,
				spatialData: treesSpatialData.default
			}
			
			dispatch(Action.views.add(viewCfg));
			dispatch(Action.views.setActiveKey(ownProps.activeView));
			dispatch(Action.views.apply(ownProps.activeView, Action));
			
			//set layers relations
			dispatch(Action.spatialRelations.add(spatialRelationsCfg));
			dispatch(Action.spatialDataSources.add(spatialDataSourcesCfg));
			dispatch(Action.spatialDataSources.vector.addBatch(data, 'spatialDataSourceKey'));
			
			//set charts
			dispatch(Action.charts.setInitial(data, 'spatialDataSourceKey'));
	
			//set selected area
			dispatch(Action.selections.updateActiveSelection('name', [8867], []));

			const spatialdataindexFilter = {
				spatialDataSourceKey: ownProps.activeSpatialDataSourceKey,
			};

			dispatch(Action.spatialDataSources.vector.addBatchIndex(spatialdataindexFilter, null, [spatialdataindexFilter], 'spatialDataSourceKey'));
		})


	}
})

const mapStateToProps = (state, ownProps) => {
	let props = {};
	
	return props;
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
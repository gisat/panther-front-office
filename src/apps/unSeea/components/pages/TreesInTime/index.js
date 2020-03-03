import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../state/Action';

import presentation from "../SubApp/presentation";

import viewCfg from "../../../data/trees_in_time/view.js";
// import spatialRelationsCfg from "../../../data/trees_in_time/spatialRelations.js";
// import spatialDataSourcesCfg from "../../../data/trees_in_time/spatialDataSources.js";
// import boundariesSpatialData from "../../../data/trees_in_time/boundaries.js";


const mapDispatchToProps = (dispatch, ownProps) => ({
	onMount: () => {
		const spatialRelationsLoader = import(/* webpackChunkName: "unseea_districts_spatialRelationsCfg" */ "../../../data/trees_in_time/spatialRelations.js").then(({default: spatialRelationsCfg}) => {
			dispatch(Action.spatialRelations.add(spatialRelationsCfg));
		});
		const spatialDataSourcesLoader = import(/* webpackChunkName: "unseea_districts_spatialDataSourcesCfg" */ "../../../data/trees_in_time/spatialDataSources.js").then(({default: spatialDataSourcesCfg}) => {
			dispatch(Action.spatialDataSources.add(spatialDataSourcesCfg));
		});
		
		// const BYMTreeDatabase_cut_2011Loader = fetch('https://cog-gisat.s3.eu-central-1.amazonaws.com/trees2011.geojson')
		// 	.then(response => response.json())
		// 	.then(spatialData => {
		// 		const data = {
		// 			spatialDataSourceKey: 'un_seea_trees_in_time_2011',
		// 			spatialData,
		// 		}
	
		// 		dispatch(Action.spatialDataSources.vector.addBatch(data, 'spatialDataSourceKey'));

		// 		//set charts
		// 		dispatch(Action.charts.setInitial(data, 'spatialDataSourceKey'));
		// 	}
		// )

		// const BYMTreeDatabase_cut_2017Loader = fetch('https://cog-gisat.s3.eu-central-1.amazonaws.com/trees2017.geojson')
		// 	.then(response => response.json())
		// 	.then(spatialData => {
		// 		const data = {
		// 			spatialDataSourceKey: 'un_seea_trees_in_time_2017',
		// 			spatialData,
		// 		}

		// 		dispatch(Action.spatialDataSources.vector.addBatch(data, 'spatialDataSourceKey'));

		// 		//set charts
		// 		dispatch(Action.charts.setInitial(data, 'spatialDataSourceKey'));
		// 	}
		// );

		const BYMTreeDatabase_cut_2011Loader = import(/* webpackChunkName: "unseea_trees_2_boundariesSpatialData" */ "../../../data/trees_in_time/trees2011_cut.json").then(({default: spatialData}) => {
			const data = {
				spatialDataSourceKey: 'un_seea_trees_in_time_2011',
				spatialData,
			}

			dispatch(Action.spatialDataSources.vector.addBatch(data, 'spatialDataSourceKey'));

			//set charts
			dispatch(Action.charts.setInitial(data, 'spatialDataSourceKey'));
		});

		const BYMTreeDatabase_cut_2017Loader = import(/* webpackChunkName: "unseea_trees_1_boundariesSpatialData" */ "../../../data/trees_in_time/trees2017_cut.json").then(({default: spatialData}) => {
			const data = {
				spatialDataSourceKey: 'un_seea_trees_in_time_2017',
				spatialData,
			}

			dispatch(Action.spatialDataSources.vector.addBatch(data, 'spatialDataSourceKey'));

			//set charts
			dispatch(Action.charts.setInitial(data, 'spatialDataSourceKey'));
		});

		

		Promise.all([spatialRelationsLoader, spatialDataSourcesLoader, BYMTreeDatabase_cut_2011Loader, BYMTreeDatabase_cut_2017Loader]).then(datasets => {
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
			dispatch(Action.selections.updateActiveSelection('name', [63844], []));

			dispatch(Action.spatialDataSources.vector.addBatchIndex({spatialDataSourceKey: 'un_seea_trees_in_time_2011'}, null, [{spatialDataSourceKey: 'un_seea_trees_in_time_2011'}], 'spatialDataSourceKey'));
			dispatch(Action.spatialDataSources.vector.addBatchIndex({spatialDataSourceKey: 'un_seea_trees_in_time_2017'}, null, [{spatialDataSourceKey: 'un_seea_trees_in_time_2017'}], 'spatialDataSourceKey'));
		})
	}
})

const mapStateToProps = (state, ownProps) => {
	let props = {};
	
	return props;
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
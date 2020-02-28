import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';
import Action from '../../../state/Action';

import presentation from "./presentation";

import viewCfg from "../../../data/districtsSecond/view.js";
// import spatialRelationsCfg from "../../../data/districtsSecond/spatialRelations.js";
// import spatialDataSourcesCfg from "../../../data/districtsSecond/spatialDataSources.js";
// import boundariesSpatialData from "../../../data/districtsSecond/boundaries.js";


const mapDispatchToProps = (dispatch, ownProps) => ({
	onMount: () => {
		const spatialRelationsLoader = import(/* webpackChunkName: "unseea_districtsSecond_spatialRelationsCfg" */ "../../../data/districtsSecond/spatialRelations.js").then(({default: spatialRelationsCfg}) => {
			dispatch(Action.spatialRelations.add(spatialRelationsCfg));
		});
		const spatialDataSourcesLoader = import(/* webpackChunkName: "unseea_districtsSecond_spatialDataSourcesCfg" */ "../../../data/districtsSecond/spatialDataSources.js").then(({default: spatialDataSourcesCfg}) => {
			dispatch(Action.spatialDataSources.add(spatialDataSourcesCfg));
		});
		const boundariesLoader = import(/* webpackChunkName: "unseea_districtsSecond_boundariesSpatialData" */ "../../../data/districtsSecond/boundaries.js").then(({default: boundariesSpatialData}) => {
			dispatch(Action.spatialDataSources.vector.addBatch(boundariesSpatialData, 'spatialDataSourceKey'));
			//set charts
			dispatch(Action.charts.setInitial(boundariesSpatialData, 'spatialDataSourceKey'));
		});

		Promise.all([spatialRelationsLoader, spatialDataSourcesLoader, boundariesLoader]).then(datasets => {
			dispatch(Action.views.add(viewCfg));
			dispatch(Action.views.setActiveKey(ownProps.activeView));
			dispatch(Action.views.apply(ownProps.activeView, Action));

			//set selected area
			dispatch(Action._deprecatedSelections.updateActiveSelection('name', ["1"], []));

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
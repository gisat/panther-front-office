import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';

import Demo from './Demo';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// base types
import areasReducers from '../../state/Areas/reducers';
import attributesReducers from '../../state/Attributes/reducers';
import attributeSetsReducers from '../../state/AttributeSets/reducers';
import choroplethReducers from '../../state/Choropleths/reducers';
import componentsReducers from '../../state/Components/reducers';
import dataviewsReducers from '../../state/Dataviews/reducers';
import layerPeriodsReducers from '../../state/LayerPeriods/reducers';
import layerTemplatesReducers from '../../state/LayerTemplates/reducers';
import mapsReducers from '../../state/Maps/reducers';
import periodsReducers from '../../state/Periods/reducers';
import placesReducers from '../../state/Places/reducers';
import scenariosReducers from '../../state/Scenarios/reducers';
import scopesReducers from '../../state/Scopes/reducers';
import snapshotsReducers from '../../state/Snapshots/reducers';
import spatialDataSourcesReducers from '../../state/SpatialDataSources/reducers';
import spatialRelationsReducers from '../../state/SpatialRelations/reducers';
import stylesReducers from '../../state/Styles/reducers';
import themesReducers from '../../state/_Themes/reducers';
import usersReducers from '../../state/Users/reducers';
import visualizationsReducers from '../../state/_Visualizations/reducers';
import wmsLayersReducers from '../../state/WmsLayers/reducers';

// Redux store
const Store = createStore(combineReducers({
	areas: areasReducers,
	attributes: attributesReducers,
	attributeSets: attributeSetsReducers,
	choropleths: choroplethReducers,
	components: componentsReducers,
	dataviews: dataviewsReducers,
	layerPeriods: layerPeriodsReducers,
	layerTemplates: layerTemplatesReducers,
	maps: mapsReducers,
	periods: periodsReducers,
	places: placesReducers,
	scenarios: scenariosReducers,
	scopes: scopesReducers,
	snapshots: snapshotsReducers,
	spatialDataSources: spatialDataSourcesReducers,
	spatialRelations: spatialRelationsReducers,
	styles: stylesReducers,
	themes: themesReducers,
	users: usersReducers,
	visualizations: visualizationsReducers,
	wmsLayers: wmsLayersReducers
}), applyMiddleware(thunk, logger));

export default () => {
	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());

	ReactDOM.render(<Provider store={Store}><Demo/></Provider>,document.getElementById('ptr'));
}
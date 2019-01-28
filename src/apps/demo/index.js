import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Action from '../../state/Action';
import i18n from '../../i18n';

import Store from './store';
import Demo from './Demo';
import Select from '../../state/Select';


export default () => {
	// Set language
	i18n.changeLanguage("cz");

	// Load Current User
	Store.dispatch(Action.users.apiLoadCurrentUser());


	// TODO only for testing
	Store.dispatch(Action.maps.addMap({key: 'Map1'}));
	Store.dispatch(Action.maps.addMap({key: 'Map2'}));
	Store.dispatch(Action.maps.addSet({key: 'MapSet1'}));
	Store.dispatch(Action.maps.addMapToSet('MapSet1', 'Map1'));
	Store.dispatch(Action.maps.addMapToSet('MapSet1', 'Map2'));
	Store.dispatch(Action.maps.setSetWorldWindNavigator('MapSet1'));
	Store.dispatch(Action.maps.setSetSync('MapSet1', {
		location: true,
		range: true
	}));

	Store.dispatch(Action.layerTemplates.useIndexed(null, null, null, 1, 1000, 'DemoIndex')).then(() => {
		let layerTemplates = Select.layerTemplates.getAllAsObject(Store.getState());
		let layerTemplatesKeys = Object.keys(layerTemplates);

		Store.dispatch(Action.spatialRelations.loadFilteredByTemplateKeys(layerTemplatesKeys)).then(() => {
			let dataSourcesKeys = Select.spatialRelations.getDataSourceKeysByLayerTemplateKeys(Store.getState(),layerTemplatesKeys);
			Store.dispatch(Action.spatialDataSources.ensureKeys(dataSourcesKeys));

			Store.dispatch(Action.maps.setMapBackgroundLayer('Map1', layerTemplatesKeys[0]));
			Store.dispatch(Action.maps.setSetBackgroundLayer('MapSet1', layerTemplatesKeys[1]));
		});
	});

	ReactDOM.render(<Provider store={Store}><Demo/></Provider>,document.getElementById('ptr'));
}
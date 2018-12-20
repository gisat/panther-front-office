import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";

import _ from 'lodash';

export default store => {
	setEventListeners(store);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'VIEWS_LOADED':
				let storedViews = Select.views.getViews(store.getState());
				let viewsToAdd = [];
				options.forEach((option) => {
					let storedView = _.find(storedViews, {key: option.id});
					if(!storedView) {
						viewsToAdd.push({key: option.id, ...option});
					}
				});
				store.dispatch(Action.views.add(viewsToAdd));
				break;
			case "VIEWS_ADD":
				store.dispatch(Action.views.add(options));
				break;
			case "ActiveViewLoaded":
				store.dispatch(Action.views.addMongoView(options));
				store.dispatch(Action.views.setActive(options._id));

				store
					.dispatch(Action.lpisCases.loadCaseForActiveView())
					.then(() => {
						return store.dispatch(Action.lpisCases.setActiveCaseByActiveView());
					}).then(() => {
						let activeCase = Select.lpisCases.getActiveCase(store.getState());
						let maps = Select.maps.getMaps(store.getState());
						if (activeCase && maps && maps.length > 1){
							addGeometries(activeCase, maps);
						}
				});

				//FIXME - to je moc natvrdo. Přidat if?
				store
					.dispatch(Action.lpisCheck.loadCaseForActiveView())
					.then(() => {
						return store.dispatch(Action.lpisCheck.setActiveCaseByActiveView());
					}).then(() => {
						let activeCase = Select.lpisCheckCases.getActiveCase(store.getState());
						let maps = Select.maps.getMaps(store.getState());
						if (activeCase && maps && maps.length > 1){
							addGeometries(activeCase, maps);
						}
				});
				break;
		}
	});
};

const addGeometries = function(activeCase, maps){
	maps.map(map => {
		if (map.placeGeometryChangeReview && map.placeGeometryChangeReview.showGeometryBefore){
			window.Stores.notify('PLACE_GEOMETRY_ADD', {
				mapKey: map.key,
				geometryKey: 'placeGeometryChangeReviewGeometryBefore',
				geometry: activeCase.data.geometry_before
			});
		}
		if (map.placeGeometryChangeReview && map.placeGeometryChangeReview.showGeometryAfter){
			window.Stores.notify('PLACE_GEOMETRY_ADD', {
				mapKey: map.key,
				geometryKey: 'placeGeometryChangeReviewGeometryAfter',
				geometry: activeCase.data.geometry_after
			});
		}
		if (map.placeGeometryLPISCheck && map.placeGeometryLPISCheck.geometry){
			window.Stores.notify('PLACE_GEOMETRY_ADD', {
				mapKey: map.key,
				geometryKey: 'placeGeometryLPISCheckGeometry',
				geometry: activeCase.data.geometry
			});
		}
	});
};
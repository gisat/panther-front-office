import Select from "../Select";
import _, {isObject} from "lodash";

function getIndex(indexes, filter, order) {
	if (indexes){
		// TODO re-reselect?
		let index = _.find(indexes, (index) => isCorrespondingIndex(index, filter, order));
		return index ? index : null;
	} else {
		return null;
	}
}

// TODO Test
function getUniqueIndexes(indexes) {
	let uniqueIndexes = [];
	indexes.forEach(index => {
		let duplicity = _.find(uniqueIndexes, (i) => {return isCorrespondingIndex(index, i.filter, i.order) });
		if (!duplicity) {
			uniqueIndexes.push(index);
		}
	});
	return uniqueIndexes;
}

function isCorrespondingIndex(index, filter, order) {
	return _.isEqual(index.filter, filter) && _.isEqual(index.order, order);
}

function itemFitFilter(filter, item) {
	// null filter fit 
	if(filter === null) {
		return true;
	}

	for (const [key, value] of Object.entries(filter)) {
		const itemHasFilterKey = item.data && item.data.hasOwnProperty(key);
		const itemHasFilterLinkKey = item.data && item.data.hasOwnProperty(`${key}Key`) ;
		if(itemHasFilterKey) {
			//apply condition
			//"column0": "hleda se rovnost",
    		//"column1": null,
			if(item.data && item.data[key] === value) {
				return true;
			}

			// "column2": {
			// 	"like": "hleda se podobnost, castecny vyskyt"
			// },
			if(isObject(value) && value['like']) {
				//now we dont deal like filter, refrest indexes
				return true;
			}

			// "column3": {
			// 	"in": ["existuje", "v", "poli", "prvku"]
			// },
			if(isObject(value) && value['in']) {
				return value.in.includes(item[key]);
			}

			// "column4": {
			// 	"notin": ["neexistuje", "v", "poli", "prvku"]
			// }
			if(isObject(value) && value['notin']) {
				return !value.notin.includes(item[key]);
			}
		}

		//check if filter contains linking like scopeKey, viewKey, ...
		if(itemHasFilterLinkKey) {
			if(item.data && item.data[`${key}Key`] === value) {
				return true;
			}
		}
	}
}

function mergeFilters(activeKeys, filterByActive, filter) {
	if (activeKeys && filterByActive) {
		let fullFilter = {...filter};
		if (filterByActive.application){
			if (activeKeys.activeApplicationKey){
				fullFilter.applicationKey = activeKeys.activeApplicationKey;
			} else {
				return null;
			}
		}
		if (filterByActive.scope){
			if (activeKeys.activeScopeKey){
				fullFilter.scope = activeKeys.activeScopeKey;
			} else {
				return null;
			}
		}
		// TODO add case, scenario, ...
		if (filterByActive.place){
			if (activeKeys.activePlaceKey){
				fullFilter.place = activeKeys.activePlaceKey;
			} else if (activeKeys.activePlaceKeys){
				fullFilter.place = {key: {in: activeKeys.activePlaceKeys}};
			} else {
				return null;
			}
		}
		if (filterByActive.period){
			if (activeKeys.activePeriodKey){
				fullFilter.period = activeKeys.activePeriodKey;
			} else if (activeKeys.activePeriodKeys){
				fullFilter.period = {key: {in: activeKeys.activePeriodKeys}};
			} else {
				return null;
			}
		}
		return fullFilter;
	} else {
		return filter;
	}
}

export default {
	getIndex,
	getUniqueIndexes,
	mergeFilters,
	isCorrespondingIndex,
	itemFitFilter,
}
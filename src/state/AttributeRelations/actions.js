import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";
import attributeActions from "../Attributes/actions";
import attributeDataActions from "../AttributeData/actions";
import statisticsActions from "../AttributeStatistics/actions";
import attributeDataSourcesActions from "../AttributeDataSources/actions";
import commonSelectors from "../_common/selectors";
import _ from "lodash";
import { quartilePercentiles } from '../../utils/statistics';


// ============ creators ===========
const useIndexedRegister = (componentId, filterByActive, filter, order, start, length) => common.useIndexedRegister(ActionTypes.ATTRIBUTE_RELATIONS, componentId, filterByActive, filter, order, start, length);
const useIndexed = common.useIndexed(Select.attributeRelations.getSubstate, 'attribute', ActionTypes.ATTRIBUTE_RELATIONS, 'relations');
const useIndexedClearAll = common.useIndexedClearAll(ActionTypes.ATTRIBUTE_RELATIONS);
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.attributeRelations.getSubstate, 'attribute', filter, order, start, length, ActionTypes.ATTRIBUTE_RELATIONS, 'relations');

// ============ actions ===========

function ensureIndexedSpecific(filter, order, start, length, componentId, noStatistic) {
    return (dispatch, getState) => {
        dispatch(common.ensureIndexed(Select.attributeRelations.getSubstate, 'attribute', filter, order, start, length, ActionTypes.ATTRIBUTE_RELATIONS, 'relations')).then(() => {
        	let filteredRelations = Select.attributeRelations.getFilteredRelations(getState(), filter);

        	if (filteredRelations) {
        		let dataSourceKeys = _.map(filteredRelations, relation => relation.attributeDataSourceKey);
				let attributeKeys = _.map(filteredRelations, relation => relation.attributeKey);

				let fidColumnNames = null;
				let attributeDataSourceKeys = [];

				filteredRelations.map(relation => {
					fidColumnNames = relation.fidColumnName; // TODO is fidColumnName still the same
					attributeDataSourceKeys.push(relation.attributeDataSourceKey);
				});

				let uniqueAtributeDataSourceKeys = _.uniq(attributeDataSourceKeys);

				let attributeDataFilter = {
					fidColumnName: fidColumnNames,
					attributeDataSourceKey: {in: uniqueAtributeDataSourceKeys}
				};

				let statisticsFilter = {
					percentile: quartilePercentiles,
					attributeDataSourceKey: {in: uniqueAtributeDataSourceKeys}
				};


				/* use attributes */
				if (attributeKeys && attributeKeys.length) {
					let uniqueKeys = _.uniq(attributeKeys);
					dispatch(attributeActions.useKeys(uniqueKeys, componentId));
				}

				/* use attribute data sources */
				dispatch(attributeDataSourcesActions.useKeys(dataSourceKeys, componentId));

				/* use attribute statistics */
				/* TODO use indexed? */
				let existingStatisticsSource = Select.attributeStatistics.getBatchByFilterOrder(getState(), statisticsFilter, null);
				if (!noStatistic && !existingStatisticsSource) {
					dispatch(statisticsActions.loadFilteredData(statisticsFilter, componentId));
				}

				/* use attribute data */
				let existingSource = Select.attributeData.getBatchByFilterOrder(getState(), attributeDataFilter, null);
				if (!existingSource) {
					dispatch(attributeDataActions.loadFilteredData(attributeDataFilter, componentId));
				}
			}
        }).catch((err) => {
        	dispatch(common.actionGeneralError(err));
        });
    }
}

function ensureIndexesWithFilterByActive(filterByActive) {
    return (dispatch, getState) => {

        let state = getState();
        let usedIndexes = commonSelectors.getUsesWithActiveDependency(Select.attributeRelations.getSubstate)(state, filterByActive);

        // TODO pass componentId
        _.each(usedIndexes, (usedIndex) => {
            _.each(usedIndex.uses, (use) => {
                dispatch(ensureIndexedSpecific(usedIndex.filter, usedIndex.order, use.start, use.length))
                // dispatch(ensureIndexedSpecificForLegend(usedIndex.filter, usedIndex.order, use.start, use.length))
            });
        });

    }
}


// ============ export ===========

export default {
	useIndexed,
	useIndexedClearAll,
    useIndexedRegister,
    ensureIndexed,
    ensureIndexesWithFilterByActive,

    // TODO join with ensure indexed
    ensureIndexedSpecific
}

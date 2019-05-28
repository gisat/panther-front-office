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
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.attributeRelations.getSubstate, 'attribute', filter, order, start, length, ActionTypes.ATTRIBUTE_RELATIONS, 'relations');

// ============ actions ===========

function ensureIndexedSpecific(filter, order, start, length, componentId, noStatistic) {
    return (dispatch, getState) => {
        dispatch(common.ensureIndexed(Select.attributeRelations.getSubstate, 'attribute', filter, order, start, length, ActionTypes.ATTRIBUTE_RELATIONS, 'relations')).then(() => {
        	let filteredRelations = Select.attributeRelations.getFilteredRelations(getState(), filter);

        	if (filteredRelations) {
				let dataSources = filteredRelations.map(relation => {
					return {
						fidColumnName: relation.fidColumnName,
						attributeDataSourceKey: relation.attributeDataSourceKey
					}
				});

				let attributeKeys = filteredRelations.map(relation => relation.attributeKey);

				if (attributeKeys && attributeKeys.length) {
					let uniqueKeys = _.uniq(attributeKeys);
					dispatch(attributeActions.useKeys(uniqueKeys, componentId));
				}

				dataSources.forEach(source => {
					const statisticsFilter = {
						attributeDataSourceKey: source.attributeDataSourceKey,
						percentile: quartilePercentiles
					};

					let existingSource = Select.attributeData.getByKey(getState(), source.attributeDataSourceKey);
					let existingStatisticsSource = Select.attributeStatistics.getBatchByFilterOrder(getState(), statisticsFilter, null);
					
					if (!existingSource) {
						dispatch(attributeDataActions.loadFilteredData(source, componentId));
					}
					if (!existingStatisticsSource && !noStatistic) {
						dispatch(statisticsActions.loadFilteredData(statisticsFilter, componentId));
					}

					dispatch(attributeDataSourcesActions.useKeys([source.attributeDataSourceKey], componentId));
				});

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
    useIndexedRegister,
    ensureIndexed,
    ensureIndexesWithFilterByActive,

    // TODO join with ensure indexed
    ensureIndexedSpecific
}

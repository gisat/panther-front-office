import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";
import _ from "lodash";
import {quartilePercentiles} from "../../utils/statistics";
import attributeActions from "../Attributes/actions";
import attributeDataSourcesActions from "../AttributeDataSources/actions";
import statisticsActions from "../AttributeStatistics/actions";
import attributeDataActions from "../AttributeData/actions";
import commonSelectors from "../_common/selectors";
import Action from "../Action";


// ============ creators ===========
const useIndexedRegister = (componentId, filterByActive, filter, order, start, length) => common.useIndexedRegister(ActionTypes.SPATIAL_RELATIONS, componentId, filterByActive, filter, order, start, length);
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.spatialRelations.getSubstate, 'spatial', filter, order, start, length, ActionTypes.SPATIAL_RELATIONS, 'relations');
const add = common.add(ActionTypes.SPATIAL_RELATIONS);
const useIndexedClearAll = common.useIndexedClearAll(ActionTypes.SPATIAL_RELATIONS);

function ensureIndexedAndEnsureDependencies(filter, order, start, length, componentId, noStatistic) {
    return (dispatch, getState) => {
        dispatch(common.ensureIndexed(Select.spatialRelations.getSubstate, 'spatial', filter, order, start, length, ActionTypes.SPATIAL_RELATIONS, 'relations')).then(() => {
            let filteredRelations = Select.spatialRelations.getFilteredData(getState(), filter);

            if (filteredRelations) {
                let dataSourceKeys = _.map(filteredRelations, relation => relation.spatialDataSourceKey);
                let uniqueDataSourcesKeys = _.uniq(dataSourceKeys);

                /* Ensure spatial data sources */
                // TODO component id?
                if (uniqueDataSourcesKeys) {
                    dispatch(Action.spatialDataSources.useKeys(uniqueDataSourcesKeys, componentId)).then(() => {
                        // TODO load data for vector data sources
                    });
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
        let usedIndexes = commonSelectors.getUsesWithActiveDependency(Select.spatialRelations.getSubstate)(state, filterByActive);

        console.log("****# FilterByActive", filterByActive);
        console.log("****# Used indexes", usedIndexes);

        // TODO pass componentId
        _.each(usedIndexes, (usedIndex) => {
            _.each(usedIndex.uses, (use) => {
                dispatch(ensureIndexedAndEnsureDependencies(usedIndex.filter, usedIndex.order, use.start, use.length))
            });
        });

    }
}


// ============ export ===========

export default {
    add,
    useIndexedRegister,
    useIndexedClearAll,
    ensureIndexed,

    ensureIndexesWithFilterByActive
}

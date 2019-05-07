import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";
import attributeActions from "../Attributes/actions";
import attributeDataActions from "../AttributeData/actions";
import commonSelectors from "../_common/selectors";
import _ from "lodash";


// ============ creators ===========
const useIndexedRegister = (componentId, filterByActive, filter, order, start, length) => common.useIndexedRegister(ActionTypes.ATTRIBUTE_RELATIONS, componentId, filterByActive, filter, order, start, length);
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.attributeRelations.getSubstate, 'attribute', filter, order, start, length, ActionTypes.ATTRIBUTE_RELATIONS, 'relations');

// ============ actions ===========

function ensureIndexedForChart(filter, order, start, length, componentId) {
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

				// TODO should be here?
				// TODO check if data are already in store

				if (attributeKeys && attributeKeys.length) {
					dispatch(attributeActions.useKeys(attributeKeys, componentId));
				}

				// todo check if data are already in store
				dataSources.forEach(source => {
					dispatch(attributeDataActions.loadFilteredData(source, componentId));
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
                dispatch(ensureIndexedForChart(usedIndex.filter, usedIndex.order, use.start, use.length))
            });
        });

    }
}


// ============ export ===========

export default {
    useIndexedRegister,
    ensureIndexed,
    ensureIndexesWithFilterByActive,

    // TODO join with ensure indexed
    ensureIndexedForChart
}

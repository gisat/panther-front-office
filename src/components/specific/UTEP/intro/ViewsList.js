import { connect } from 'react-redux';

import Select from '../../../../state/Select';
import ViewsList from "../../../presentation/controls/ViewsList/ViewsList";
import utils from "../../../../utils/utils";
import Action from "../../../../state/Action";

const order = [['key', 'ascending']];

const mapStateToProps = (state) => {
    let selectedScopeData = Select.components.overlays.views.getSelectedScopeData(state);
    let views, scopeKey;
    if(selectedScopeData) {
        views = Select.dataviews.getViewsForScope(state, selectedScopeData);
        scopeKey = selectedScopeData.key;
    } else {
        views = Select.dataviews.getAllForActiveScope(state, order);
        scopeKey = Select.scopes.getActiveKey(state);
    }

    return {
        scopeKey: scopeKey,
        views: views,
        hideTitle: false
    }
};

const mapDispatchToPropsFactory = () => {

    const componentId = 'ViewsList_' + utils.randomString(6);

    return (dispatch) => {
        return {
            onMount: () => {
                dispatch(Action.dataviews.useIndexed({scope: true}, null, order, 1, 1000, componentId));
            },
            onUnmount: () => {
                dispatch(Action.dataviews.useIndexedClear(componentId));
            }
        }
    }
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(ViewsList);

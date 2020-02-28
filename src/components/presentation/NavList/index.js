import {connect} from '@gisatcz/ptr-state';
import presentation from "./presentation";
import {Select, Action} from '@gisatcz/ptr-state';

const mapStateToProps = (state, ownProps) => {
    return {
        componentData: Select.components.getDataByComponentKey(state, ownProps.componentKey)
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        update: (data) => {
            dispatch(Action.components.update(ownProps.componentKey, data))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
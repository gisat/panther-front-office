import { connect } from 'react-redux';
import presentation from "./presentation";
import Action from '../../../state/Action';
import Select from '../../../state/Select';

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
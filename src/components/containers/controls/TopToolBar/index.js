import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import config from '../../../../config';

import TopToolBar from './TopToolBar';

const mapStateToProps = state => {
    return {
        user: state.users.loggedIn,
        links: config.toggles.topLinks
    }
};

const mapDispatchToProps = dispatch => {
    return {
        login: (layerKey, mapKey) => {
            dispatch(Action.maps.clearLayerPeriod(layerKey, mapKey));
        },
        logout: (layerKey, mapKey) => {
            dispatch(Action.maps.clearWmsLayer(layerKey, mapKey));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TopToolBar);
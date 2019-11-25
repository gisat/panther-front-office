import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		viewSelectOpen: Select.components.get(state, 'szdcInsar19_ViewSelect', 'viewSelectOpen'),
		activeAppView: Select.components.get(state, 'szdcInsar19_App', 'activeAppView')
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		openViewSelect: () => {
			dispatch(Action.components.set('szdcInsar19_ViewSelect', 'viewSelectOpen', true))
		},
		closeViewSelect: () => {
			dispatch(Action.components.set('szdcInsar19_ViewSelect', 'viewSelectOpen', false))
		},
		selectAppView: key => {
			dispatch(Action.components.set('szdcInsar19_App', 'activeAppView', key))
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
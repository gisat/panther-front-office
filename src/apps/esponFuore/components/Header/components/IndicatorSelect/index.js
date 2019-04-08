import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		indicatorSelectOpen: Select.components.get(state, 'esponFuore_IndicatorSelect', 'indicatorSelectOpen')
	}
};

const mapDispatchToProps = dispatch => {
	return {
		openIndicatorSelect: () => {
			dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', true))
		},
		closeIndicatorSelect: () => {
			dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', false))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
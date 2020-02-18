import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const order = [['submitDate', 'descending']];

const mapStateToProps = state => {
	return {
		cases: Select.specific.lpisChangeCases.getIndexed(state, null, null, order, 1, 1000)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'SzifCaseTable' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.lpisChangeCases.useIndexed(null, null, order, 1, 1000, componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
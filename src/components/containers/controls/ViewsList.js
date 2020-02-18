import { connect } from 'react-redux';

import Select from '../../../state/Select';
import ViewsList from "../../presentation/controls/ViewsList/ViewsList";
import {utils} from '@gisatcz/ptr-utils'
import Action from "../../../state/Action";

const order = [['key', 'ascending']];

const mapStateToProps = (state) => {
	return {
		views: Select.dataviews.getAllForActiveScope(state, order),
		hideTitle: !Select.components.isAppInIntroMode(state)
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

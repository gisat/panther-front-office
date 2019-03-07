import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";
import apps from '../../../../apps';

const order = [['name', 'ascending']];

const mapStateToProps = () => {
	return state => {
		return {
			apps,
			// activeKey: Select.apps.getActiveKey(state),
			// apps: Select.apps.get(null, null, order, 1, 100)
		}
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'backOffice_AppSelect_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				// Action.apps.useIndexed(null, null, order, 1, 100, componentId)
			},
			onChange: (key) => {
				// dispatch(Action.apps.setActive(key));
			},
			onUnmount: () => {
				// dispatch(Action.apps.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';
import {utils} from "panther-utils"

import presentation from "./presentation";
import apps from '../../../../apps';

const order = [['name', 'ascending']];

const mapStateToProps = (state, ownProps) => {
	if (ownProps.managedAppKey) {
		return {
			apps,
			activeKey: ownProps.managedAppKey,
			storeApps: {[ownProps.managedAppKey]: Select.specific.apps.getActive(state)}
			// storeApps: Select.apps.get(null, null, order, 1, 100)
		}
	} else {
		return {
			apps,
			activeKey: Select.specific.apps.getActiveKey(state),
			storeApps: Select.specific.apps.getAllAsObject(state)
			// storeApps: Select.apps.get(null, null, order, 1, 100)
		}
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'backOffice_AppSelect_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		if (ownProps.managedAppKey) {
			return {
				onMount: () => {
					dispatch(Action.specific.apps.useKeys([ownProps.managedAppKey], componentId));
				},
				onChange: () => {},
				onUnmount: () => {
					dispatch(Action.specific.apps.useKeysClear(componentId));
				}
			}
		} else {
			return {
				onMount: () => {
					dispatch(Action.specific.apps.useIndexed(null, null, order, 1, 100, componentId));
				},
				onChange: (key) => {
					dispatch(Action.specific.apps.setActiveKeyAndEnsureDependencies(key));
					dispatch(Action.screens.removeAllScreensFromSet('metadata',));
				},
				onUnmount: () => {
					dispatch(Action.specific.apps.useIndexedClear(componentId));
				}
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
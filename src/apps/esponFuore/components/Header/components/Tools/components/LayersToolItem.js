import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import presentation from "./ToolItem";
import LayersTree from "../../../../../../../components/common/maps/LayersTree";

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: Select.windows.isOpen(state, ownProps.itemKey)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		closeWindow: () => {
			dispatch(Action.windows.remove(ownProps.windowSetKey, ownProps.itemKey));
		},
		openWindow: () => {
			dispatch(Action.windows.addOrOpen(
				ownProps.windowSetKey,
				ownProps.itemKey,
				{
					title: "Layers"
				},
				LayersTree,
				{
					componentKey: "LayersTree_demo",
					scopeKey:'c883e330-deb2-4bc4-b1e3-6b412791e5c0',
					applicationKey: 'esponFuore'
				})
			);
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
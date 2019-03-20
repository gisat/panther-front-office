import { connect } from 'react-redux';
import Select from '../../../../../../state/Select';
import Action from "../../../../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../../utils/utils";

const order = [['name', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.apps.getActiveOrAll(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'MetadataConfigs_AppSelect_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.apps.useIndexed(null, null, order, 1, 100, componentId));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useKeysClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
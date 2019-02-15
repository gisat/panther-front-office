import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		models: Select.layerTemplates.getAll(state) //TODO select filtered?
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplatesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.layerTemplates.useIndexed(null, null, order, 1, 1000, componentId)); // TODO filter?
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);

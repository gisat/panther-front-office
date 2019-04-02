import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';
import IndicatorMetadataScreen from "../metadata/screens/EsponFuoreIndicatorMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.esponFuoreIndicators.getAllOrdered(state, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'EsponFuoreIndicatorsList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-esponFuoreIndicatorConfig', 40, 40, IndicatorMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexed(null, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexedClear(componentId));
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.esponFuoreIndicators.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-esponFuoreIndicatorConfig', 40, 40, IndicatorMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);

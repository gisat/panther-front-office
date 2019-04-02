import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';
import IndicatorMetadataScreen from "../metadata/screens/IndicatorMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.indicators.getAllOrdered(state, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'IndicatorsList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-indicatorConfig', 40, 40, IndicatorMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.indicators.useIndexed(null, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.indicators.useIndexedClear(componentId));
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.indicators.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-indicatorConfig', 40, 40, IndicatorMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);

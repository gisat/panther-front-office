import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import PlaceSelector from '../../presentation/view-selectors/PlaceSelector';
import utils from "../../../utils/utils";

// TODO is this correct approach?

const mapStateToPropsFactory = () => {
	const componentId = 'PlaceSelector_' + utils.randomString(6);

	return state => {
		return {
			componentId: componentId,
			isInIntroMode: Select.components.isAppInIntroMode(state),
			activePlace: Select.places.getActive(state),
			places: Select.places.getAllForIndexInUseByComponentId(state, componentId),
			scopeKey: Select.scopes.getActiveScopeKey(state)
		}
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onChangePlace: (key) => {
			dispatch(Action.places.setActive(key));
			dispatch(Action.scenarios.loadCases());
			dispatch(Action.spatialRelations.load());
		},
		onScopeChange: (key, componentId) => {
			dispatch(Action.places.useIndexed({dataset: key}, [['name', 'ascending']], 1, 1000, componentId));
		}
	}
};

export default connect(mapStateToPropsFactory, mapDispatchToProps)(PlaceSelector);
import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import PlaceSelector from '../../presentation/view-selectors/PlaceSelector';
import {utils} from '@gisatcz/ptr-utils'

const order = [['name', 'ascending']];

const mapStateToPropsFactory = () => {
	return state => {
		return {
			isInIntroMode: Select.components.isAppInIntroMode(state),
			activePlace: Select.places.getActive(state),
			places: Select.places.getAllForActiveScope(state, order)
		}
	}
};

const mapDispatchToProps = dispatch => {
	const componentId = 'PlaceSelector_' + utils.randomString(6);

	return {
		onChangePlace: (key) => {
			dispatch(Action.places.setActive(key));
			dispatch(Action.scenarios.loadCases());
			dispatch(Action.spatialRelations.load());
		},
		onMount: () => {
			dispatch(Action.places.useIndexed({scope: true}, null, order, 1, 1000, componentId));
		},
		onUnmount: () => {
			dispatch(Action.places.useIndexedClear(componentId));
		}
	}
};

export default connect(mapStateToPropsFactory, mapDispatchToProps)(PlaceSelector);
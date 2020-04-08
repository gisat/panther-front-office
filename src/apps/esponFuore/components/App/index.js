import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		activeScopeKey: Select.scopes.getActiveKey(state),
		activeScope: Select.scopes.getActive(state),
		activeAttributeKey: Select.attributes.getActiveKey(state),
		activePeriodKeys: Select.periods.getActiveKeys(state),
		activeLevel: Select.app.getLocalConfiguration(state, "activeAuLevel"),
		attribute: Select.attributes.getActive(state),
		timelineHeight: Select.components.get(state, "esponFuore_Timeline", "height")
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onSelectionClear: () => {
			dispatch(Action.specific.esponFuoreSelections.clearActiveSelection());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import WorldWindow from "../../../../presentation/windows/ScenariosWindow/WorldWindow/WorldWindow";

const mapStateToProps = (state, ownProps) => {
	return {
		activeBackgroundLayerKey: Select.maps.getActiveBackgroundLayerKey(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(WorldWindow);
import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import SnapshotsWindow from "../../../presentation/windows/SnapshotsWindow/SnapshotsWindow";

const mapStateToProps = (state, ownProps) => {
	return {
		snapshots: Select.snapshots.getAll(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		createMapSnapshot: () => {
			dispatch(Action.snapshots.createMapSnapshot());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotsWindow);
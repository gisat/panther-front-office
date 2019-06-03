import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import SnapshotCard from "../../presentation/controls/SnapshotCard/SnapshotCard";

const mapStateToProps = (state, ownProps) => {
	return {
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: () => {
			dispatch(Action.snapshots.remove(ownProps.snapshotKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotCard);
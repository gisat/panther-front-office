import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import MapEditingControlPanel from "../../../presentation/controls/mapEditing/MapEditingControlPanel/MapEditingControlPanel";

const mapStateToProps = (state, ownProps) => {
	return {
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MapEditingControlPanel);
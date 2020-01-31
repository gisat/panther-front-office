import { connect } from 'react-redux';
import Select from '../../state/Select';
import presentation from './presentation';


const mapStateToProps = (state, ownProps) => {
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	return {
		activeCase,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);

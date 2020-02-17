import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../state/Action';
import Select from '../../state/Select';
import {utils} from "panther-utils"

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		categoryTagKey: Select.app.getConfiguration(state, 'categoryTagKey'),
		subCategoryTagKey: Select.app.getConfiguration(state, 'subCategoryTagKey')
	}
};

const mapDispatchToProps = dispatch => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
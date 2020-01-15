import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";

const mapStateToProps = state => {
	return {
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'SzifCaseForm' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
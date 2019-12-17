import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";


const mapStateToProps = (state, ownProps) => {
	return {

	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'szdcInsar19_PointInfo' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {

		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
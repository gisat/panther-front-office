import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";


const mapStateToProps = (state) => {
	return {
	}
};

const mapDispatchToProps = () => {
	return {
		onManage: () => {
			debugger;
		},
		onSave: () => {

		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
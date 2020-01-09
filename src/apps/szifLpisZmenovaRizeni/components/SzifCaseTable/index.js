import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import presentation from "./presentation";
import mockCases from "../../data/mock-cases";

const mapStateToProps = state => {
	return {
		cases: mockCases.data
	}
};

const mapDispatchToProps = state => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
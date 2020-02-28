import {connect} from 'react-redux';
import _ from 'lodash';

import Action from '../../state/Action';
import Select from '../../state/Select';
import {utils} from '@gisatcz/ptr-utils'

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
	}
};

const mapDispatchToProps = () => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
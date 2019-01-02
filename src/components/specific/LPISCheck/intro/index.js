import React from 'react';
import { connect } from 'react-redux';

import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import Presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);

import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import utils from '../../../../../utils/utils';

import presentation from "./presentation";

const PERIODS = [{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}},{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}},{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}},{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}},{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}},{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}},{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}},{data: {nameDisplay: 2005}},{data: {nameDisplay: 2006}},{data: {nameDisplay: 1997}}];

const mapStateToProps = (state, ownProps) => {
	// TODO replace mock
	return {
		periods: PERIODS
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_Timeline_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {

		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
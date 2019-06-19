import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../../state/Action';
import Select from '../../../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	
	let filter = {
		tagKeys: {
			includes: [ownProps.categoryKey]
		}
	};
	
	return {
		cases: Select.cases.getIndexed(state, null, filter, null, 1, 20),
		activeCase: Select.cases.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'tacrGeoinvaze_CaseList_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		
		let filter = {
			tagKeys: {
				includes: [ownProps.categoryKey]
			}
		};
		
		return {
			onMount: () => {
				// TODO order
				dispatch(Action.cases.useIndexed(null, filter, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.cases.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
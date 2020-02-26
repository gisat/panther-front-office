import { connect } from 'react-redux';
import {Action, Select} from '@gisatcz/ptr-state';
import {utils} from '@gisatcz/ptr-utils'

import presentation from "./presentation";

let order = [["nameDisplay", "ascending"]];

const mapStateToProps = (state, ownProps) => {
	
	let filter = {
		tagKeys: {
			includes: [ownProps.categoryKey]
		}
	};
	
	return {
		cases: Select.cases.getIndexed(state, null, filter, order, 1, 100),
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
				dispatch(Action.cases.useIndexed(null, filter, order, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.cases.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
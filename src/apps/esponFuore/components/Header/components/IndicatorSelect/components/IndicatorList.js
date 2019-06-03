import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import utils from '../../../../../../../utils/utils';
import {PantherSelectItem} from "../../../../../../../components/common/atoms/PantherSelect";
import React from "react";

let categoryKey = null;
let filter = null;
const filterByActive = {scope: true};

const mapStateToProps = (state, ownProps) => {

	// don't mutate selector input if it is not needed
	if (categoryKey !== ownProps.categoryKey){
		filter = {tagKeys: {includes: [ownProps.categoryKey]}};
		categoryKey = ownProps.categoryKey;
	}

	return {
		indicators: Select.specific.esponFuoreIndicators.getIndexed(state, filterByActive, filter, null, 1, 100),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_IndicatorList_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			registerUse: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexed({scope: true}, {tagKeys: {includes: [ownProps.categoryKey]}}, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexedClear(componentId));
			}
		}
	}
};

class IndicatorList extends React.PureComponent {

	componentDidMount() {
		this.props.registerUse();
	}

	componentDidUpdate(prevProps) {
		if (this.props.categoryKey && this.props.categoryKey !== prevProps.categoryKey) {
			this.props.registerUse();
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		return this.props.indicators && this.props.indicators.map((indicator, index) => {
			let className = '';
			if (indicator.key === this.props.activeIndicator) {
				className = 'selected';
			}

			// TODO generate previews
			if (index > 4) index = 1;
			let thumbnailSource = `url(${require('../../../../../assets/img/thumbnail_' + index + '.jpg')})`;

			return (
				<PantherSelectItem
					key={indicator.key}
					itemKey={indicator.key}
					className={className}
					style={{backgroundImage: thumbnailSource}}
				>
					<span>{indicator.data.nameDisplay}</span>
				</PantherSelectItem>
			);
		}) || null;
	}

}

export default connect(mapStateToProps, mapDispatchToPropsFactory)(IndicatorList);
import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import utils from '../../../../../../../utils/utils';
import {PantherSelectItem} from "../../../../../../../components/common/atoms/PantherSelect";
import React from "react";
import scopePreview0 from "../../../../../assets/img/preview_0.png";


const mapStateToProps = (state, ownProps) => {
	return {
		indicators: Select.specific.esponFuoreIndicators.getIndexed(state, null, {tagKeys: {includes: [ownProps.categoryKey]}}, null, 1, 100),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_IndicatorList_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			registerUse: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexed(null, {tagKeys: {includes: [ownProps.categoryKey]}}, null, 1, 20, componentId));
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
		return this.props.indicators && this.props.indicators.map(indicator => {
			let className = '';
			if (indicator.key === this.props.activeIndicator) {
				className = 'selected';
			}
			return (
				<PantherSelectItem
					key={indicator.key}
					itemKey={indicator.key}
					className={className}
					style={{backgroundImage: `url(${scopePreview0})`}}
				>
					<span>{indicator.data.nameDisplay}</span>
				</PantherSelectItem>
			);
		}) || null;
	}

}

export default connect(mapStateToProps, mapDispatchToPropsFactory)(IndicatorList);
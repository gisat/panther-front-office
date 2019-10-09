import React from "react";
import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import utils from '../../../../../../../utils/utils';
import {PantherSelectItem} from "../../../../../../../components/common/atoms/PantherSelect";
import IndicatorCard from "./IndicatorCard";

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
		attributes: Select.attributes.getAttributes(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_IndicatorList_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			registerUse: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexedIndicatorsWithAttributes({scope: true}, {tagKeys: {includes: [ownProps.categoryKey]}}, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexedClear(componentId));
				dispatch(Action.attributes.useKeysClear(componentId));
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
		const props = this.props;

		if (props.indicators) {
			return props.indicators.map((indicator, index) => {
				if (indicator) {
					let className = '';
					if (indicator.key === this.props.activeIndicator) {
						className = 'selected';
					}

					let attribute = _.find(props.attributes, {key: indicator.data.attributeKey});

					return (
						<PantherSelectItem
							key={indicator.key}
							itemKey={indicator.key}
							className={className}
						>
							<IndicatorCard
								indicator={indicator}
								attribute={attribute}
								index={index}
							/>
						</PantherSelectItem>
					);
				} else {
					return null;
				}
			});
		} else {
			return null;
		}
	}
}

export default connect(mapStateToProps, mapDispatchToPropsFactory)(IndicatorList);
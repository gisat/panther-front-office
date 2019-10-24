import React from "react";
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';

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
	
	// todo don't mutate selector input each time (dedicate selector?)
	let subCategoryFilter = {tagKeys: {includes: [ownProps.subCategoryTagKey, ownProps.categoryKey]}};

	return {
		indicators: Select.specific.esponFuoreIndicators.getIndexed(state, filterByActive, filter, null, 1, 1000),
		attributes: Select.attributes.getAttributes(state),
		subCategories: Select.tags.getIndexed(state, filterByActive, subCategoryFilter, null, 1, 20),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_IndicatorList_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			registerUse: () => {
				if (ownProps.categoryKey) {
					dispatch(Action.specific.esponFuoreIndicators.useIndexedIndicatorsWithAttributes({scope: true}, {tagKeys: {includes: [ownProps.categoryKey]}}, null, 1, 1000, componentId));
				}
				dispatch(Action.tags.useIndexed(filterByActive, {tagKeys: {includes: [ownProps.subCategoryTagKey, ownProps.activeCategoryKey]}}, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexedClear(componentId));
				dispatch(Action.attributes.useKeysClear(componentId));
			}
		}
	}
};

class IndicatorList extends React.PureComponent {
	
	constructor(props) {
		super(props);
		
		this.renderIndicator = this.renderIndicator.bind(this);
		this.renderSubCategory = this.renderSubCategory.bind(this);
	}


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
		
		const getIndicatorSubCategory = (indicator) => {
			if (indicator) {
				if (indicator.data.tagKeys.length) {
					let keyArray = _.filter(indicator.data.tagKeys, key => {
						return key !== props.categoryKey;
					});
					return keyArray[0];
				}
			}
			return null;
		};

		if (props.indicators) {
			
			if (props.subCategories) {
				
				let indicators = _.compact(props.indicators); //todo filter unloaded or not?
				let groupedIndicators = _.groupBy(indicators, getIndicatorSubCategory);
				let noSubCategory = groupedIndicators[null] || null;
				delete groupedIndicators[null];
				
				return (
					<>
						{noSubCategory && noSubCategory.map(this.renderIndicator)}
						{props.subCategories.map(subCategory => this.renderSubCategory(subCategory, groupedIndicators[subCategory.key]))}
					</>
				);
				
			}
			
			return (
				<div className="esponFuore-indicator-list-indicators">
					{props.indicators.map(this.renderIndicator)}
				</div>
			);
		} else {
			return null;
		}
	}
	
	renderSubCategory(subCategory, indicators) {
		return (
			<div className="esponFuore-indicator-list-subCategory" key={subCategory.key}>
				<div className="esponFuore-indicator-list-subCategory-header">{subCategory.data.nameDisplay}</div>
				<div className="esponFuore-indicator-list-indicators">
					{indicators ? indicators.map(this.renderIndicator) : null}
				</div>
			</div>
		);
	}
	
	renderIndicator(indicator, index) {
		if (indicator) {
			
			let attribute = _.find(this.props.attributes, {key: indicator.data.attributeKey});
			
			return (
				<PantherSelectItem
					key={indicator.key}
					itemKey={indicator.key}
					className={classNames('esponFuore-indicator-list-indicator', {
						selected: indicator.key === this.props.activeIndicator
					})}
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
	}
	
}

export default connect(mapStateToProps, mapDispatchToPropsFactory)(IndicatorList);
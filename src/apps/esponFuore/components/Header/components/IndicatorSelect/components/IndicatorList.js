import React from "react";
import {connect} from '@gisatcz/ptr-state';
import _ from 'lodash';
import classNames from 'classnames';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import {utils} from '@gisatcz/ptr-utils'
import {PantherSelectItem} from '@gisatcz/ptr-atoms';
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
		subCategories: Select.tags.getIndexed(state, filterByActive, subCategoryFilter, null, 1, 1000),
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

				if (ownProps.subCategoryTagKey && ownProps.categoryKey) {
					dispatch(Action.tags.useIndexed(filterByActive, {tagKeys: {includes: [ownProps.subCategoryTagKey, ownProps.categoryKey]}}, null, 1, 1000, componentId));
				}
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
		this.populateRefs = this.populateRefs.bind(this);
		this.onSubCategoryChange = this.onSubCategoryChange.bind(this);
		
		this.subRefs = {};
	}


	componentDidMount() {
		this.props.registerUse();
		if (this.props.subCategories) {
			this.populateRefs();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.categoryKey && this.props.categoryKey !== prevProps.categoryKey) {
			this.props.registerUse();
		}
		if (this.props.activeSubCategoryKey && this.props.activeSubCategoryKey !== prevProps.activeSubCategoryKey) {
			this.onSubCategoryChange();
		}
		if (this.props.subCategories && this.props.subCategories !== prevProps.subCategories) {
			this.populateRefs();
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}
	
	populateRefs() {
		_.each(this.props.subCategories, subCategory => {
			this.subRefs[subCategory.key] = this.subRefs[subCategory.key] || React.createRef();
		});
	}
	
	onSubCategoryChange() {
		this.subRefs[this.props.activeSubCategoryKey].current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
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
			<div
				className="esponFuore-indicator-list-subCategory"
				key={subCategory.key}
				ref={this.subRefs[subCategory.key]}
			>
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
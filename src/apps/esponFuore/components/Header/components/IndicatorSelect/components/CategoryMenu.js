import React from "react";
import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import utils from '../../../../../../../utils/utils';

let categoryKey = null;
let filter = null;
const filterByActive = {scope: true};

const mapStateToProps = (state, ownProps) => {
	
	// todo don't mutate selector input each time (dedicate selector?)
	let categoryFilter = {tagKeys: {includes: [ownProps.categoryTagKey]}};
	let subCategoryFilter = {tagKeys: {includes: [ownProps.subCategoryTagKey, ownProps.activeCategoryKey]}};

	return {
		categories: Select.tags.getIndexed(state, filterByActive, categoryFilter, null, 1, 20),
		subCategories: Select.tags.getIndexed(state, filterByActive, subCategoryFilter, null, 1, 20),
	}
};

const mapDispatchToPropsFactory = (dispatch, ownProps) => {
	const componentId = 'esponFuore_CategoryMenu_' + utils.randomString(6);
	let categoryFilter = {tagKeys: {includes: [ownProps.categoryTagKey]}};
	let subCategoryFilter = {tagKeys: {includes: [ownProps.subCategoryTagKey, ownProps.activeCategoryKey]}};

	return (dispatch, ownProps) => {
		return {
			onMount: () => {
				dispatch(Action.tags.useIndexed(filterByActive, categoryFilter, null, 1, 20, componentId));
				dispatch(Action.tags.useIndexed(filterByActive, subCategoryFilter, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId));
			}
		}
	}
};


class CategoryMenu extends React.PureComponent {

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		const props = this.props;
		
		return (
			<>
				{props.categories && props.categories.map(category => {
					if(category) {
						let isActive = category.key === props.activeCategoryKey;
						let className = isActive ? 'selected' : '';
						let subCategories = isActive ? this.renderSubCategories() : null;
				
						return (
							<>
								<a
									key={category.key}
									onClick={props.selectCategory.bind(null, category.key)}
									className={className}
								>
									{category.data.nameDisplay}
								</a>
								{subCategories}
							</>
						);
					}
				})}
			</>
		);
	}
	
	renderSubCategories() {
		const props = this.props;
		
		return (
			<>
				{props.subCategories && props.subCategories.map(subCategory => (
					<a
						key={subCategory.key}
						onClick={props.selectSubCategory.bind(null, subCategory.key)}
						className="esponFuore-indicator-select-menu-subCategory"
					>
						{subCategory.data.nameDisplay}
					</a>
				))}
			</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToPropsFactory)(CategoryMenu);
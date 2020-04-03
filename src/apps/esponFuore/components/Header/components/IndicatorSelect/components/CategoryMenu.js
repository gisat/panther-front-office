import React from "react";
import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import utils from '../../../../../../../utils/utils';


let activeCategoryKey = null;
let subCategoryTagKey = null;
let subCategoryFilter =  null;
const filterByActive = {scope: true};

const mapStateToProps = (state, ownProps) => {
	if (activeCategoryKey !== ownProps.activeCategoryKey || subCategoryTagKey !== ownProps.subCategoryTagKey) {
		subCategoryFilter = {tagKeys: {includes: [ownProps.subCategoryTagKey, ownProps.activeCategoryKey]}};
	}

	activeCategoryKey = ownProps.activeCategoryKey;
	subCategoryTagKey = ownProps.subCategoryTagKey;

	return {
		subCategories: Select.specific.esponFuore.getOrderedSubcategories(state, filterByActive, subCategoryFilter, null, 1, 100),
	}
};

const mapDispatchToPropsFactory = (dispatch, ownProps) => {
	const componentId = 'esponFuore_CategoryMenu_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			registerUse: () => {
				if (ownProps.subCategoryTagKey && ownProps.activeCategoryKey) {
					dispatch(Action.tags.useIndexed(filterByActive, {tagKeys: {includes: [ownProps.subCategoryTagKey, ownProps.activeCategoryKey]}}, null, 1, 100, componentId));
				}
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId));
			}
		}
	}
};


class CategoryMenu extends React.PureComponent {

	componentDidMount() {
		this.props.registerUse();
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.activeCategoryKey && this.props.activeCategoryKey !== prevProps.activeCategoryKey) {
			this.props.registerUse();
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		const props = this.props;
		
		return (
			<>
				{props.categories && props.categories.map((category, i) => {
					if(category) {
						let isActive = category.key === props.activeCategoryKey;
						let className = isActive ? 'selected' : '';
						let subCategories = isActive ? this.renderSubCategories() : null;
				
						return (
							<React.Fragment key={i}>
								<a
									key={category.key}
									onClick={props.selectCategory.bind(null, category.key)}
									className={className}
								>
									{category.data.nameDisplay}
								</a>
								{subCategories}
							</React.Fragment>
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
				{props.subCategories && props.subCategories.map(subCategory => {
					if (subCategory) {
						return (
							<a
								key={subCategory.key}
								onClick={props.selectSubCategory.bind(null, subCategory.key)}
								className="esponFuore-indicator-select-menu-subCategory"
							>
								{subCategory.data.nameDisplay}
							</a>
						);
					}
				})}
			</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToPropsFactory)(CategoryMenu);
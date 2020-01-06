import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import Input from "../../../../../../components/common/atoms/Input/Input";
import Icon from "../../../../../../components/common/atoms/Icon";
import IndicatorList from "./components/IndicatorList";
import CategoryMenu from "./components/CategoryMenu";


class IndicatorSelect extends React.PureComponent {

	constructor(props) {
		super(props);
		
		this.state = {
			activeSubCategoryKey: null
		};

		this.renderCurrent = this.renderCurrent.bind(this);
		this.selectSubCategory = this.selectSubCategory.bind(this);
		this.resetActiveSubcategory = this.resetActiveSubcategory.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.activeCategoryKey && this.props.activeCategoryKey !== prevProps.activeCategoryKey) {
			this.selectSubCategory(null);
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}
	
	selectSubCategory(key) {
		if (this.state.activeSubCategoryKey !== key) {
			this.setState({
				activeSubCategoryKey: key
			});
			// this.props.onSelectSubCategory(key);
		}
	}

	resetActiveSubcategory() {
		this.selectSubCategory(null);
	}


	renderCurrent() {
		const props = this.props;

		if (props.activeIndicator) {
			return (
				<>
					<div className="esponFuore-indicator-select-current-category" title={props.activeIndicatorCategory && props.activeIndicatorCategory.data && props.activeIndicatorCategory.data.nameDisplay}>{props.activeIndicatorCategory && props.activeIndicatorCategory.data && props.activeIndicatorCategory.data.nameDisplay}</div>
					<div className="esponFuore-indicator-select-current-indicator" title={props.activeIndicator && props.activeIndicator.data && props.activeIndicator.data.nameDisplay}>{props.activeIndicator.data.nameDisplay}</div>
				</>
			);
		} else {
			//no indicator
			return (
				<span className="esponFuore-indicator-select-current-empty">Select indicator</span>
			);
		}
	};

	render() {
		const props = this.props;
		let activeCategoryKey = props.activeCategoryKey || props.categories && props.categories[0] && props.categories[0].key || null;

		return (

			<PantherSelect
				className="esponFuore-indicator-select"
				open={props.indicatorSelectOpen || !props.activeIndicator}
				onSelectClick={() => {
					(props.indicatorSelectOpen && props.activeIndicator) ? props.closeIndicatorSelect() : props.openIndicatorSelect()
				}}
				onSelect={this.props.selectIndicator}
				currentClasses="esponFuore-indicator-select-current"
				renderCurrent={this.renderCurrent}
				listClasses="esponFuore-indicator-select-list"
			>
				<div className="esponFuore-indicator-select-content">
					<div className="esponFuore-indicator-select-sidebar">
						<div className="esponFuore-indicator-select-search">
							<Input value={props.searchValue} onChange={props.onChangeSearch}><Icon icon="search"/></Input>
						</div>
						<div className="esponFuore-indicator-select-categories">
							<CategoryMenu
								activeCategoryKey={activeCategoryKey}
								categories={props.categories}
								subCategoryTagKey={props.subCategoryTagKey}
								selectCategory={props.selectCategory}
								activeSubCategoryKey={this.state.activeSubCategoryKey}
								selectSubCategory={this.selectSubCategory}
							/>
						</div>
					</div>
					<div className="esponFuore-indicator-select-indicators" onScroll={this.resetActiveSubcategory}>
						<IndicatorList
							categoryKey={activeCategoryKey}
							activeSubCategoryKey={this.state.activeSubCategoryKey}
							subCategoryTagKey={props.subCategoryTagKey}
						/>
					</div>
				</div>
			</PantherSelect>

		);
	}
}

export default IndicatorSelect;

import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import Input from "../../../../../../components/common/atoms/Input/Input";
import Icon from "../../../../../../components/common/atoms/Icon";
import IndicatorList from "./components/IndicatorList";


class IndicatorSelect extends React.PureComponent {

	constructor(props) {
		super(props);

		this.renderCurrent = this.renderCurrent.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
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
							{props.categories && props.categories.map(category => {
								let className = '';
								if (category.key === activeCategoryKey) {
									className = 'selected';
								}
								return (
									<a
										key={category.key}
										onClick={props.selectCategory.bind(null, category.key)}
										className={className}
									>
										{category.data.nameDisplay}
									</a>
								);
							})}
						</div>
					</div>
					<div className="esponFuore-indicator-select-indicators">
						<IndicatorList categoryKey={activeCategoryKey}/>
					</div>
				</div>
			</PantherSelect>

		);
	}
}

export default IndicatorSelect;

import React from "react";

import './style.scss';
import PantherSelect, {PantherSelectItem} from "../../../../../../components/common/atoms/PantherSelect";
import Input from "../../../../../../components/common/atoms/Input/Input";
import Icon from "../../../../../../components/common/atoms/Icon";


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

		if (props.indicator) {
			return (
				<>
					<div className="esponFuore-indicator-select-current-category">Employment</div>
					<div className="esponFuore-indicator-select-current-indicator" title={props.indicator.data.nameDisplay}>{props.indicator.data.nameDisplay}</div>
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

		return (

			<PantherSelect
				className="esponFuore-indicator-select"
				open={props.indicatorSelectOpen}
				onSelectClick={() => {
					props.indicatorSelectOpen ? props.closeIndicatorSelect() : props.openIndicatorSelect()
				}}
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
								if (category.key === props.activeCategory) {
									className = 'selected';
								}
								return (
									<a
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
						<PantherSelectItem itemKey="one">an item</PantherSelectItem>
						<PantherSelectItem itemKey="two">an item</PantherSelectItem>
						<PantherSelectItem itemKey="three">an item</PantherSelectItem>
					</div>
				</div>
			</PantherSelect>

		);
	}
}

export default IndicatorSelect;

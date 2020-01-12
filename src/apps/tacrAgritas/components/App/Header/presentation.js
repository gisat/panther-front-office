import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import './style.scss';
import Select from "../../../../../components/common/atoms/Select/Select";

const BUFFER = 30;

class Header extends React.PureComponent {
	static propTypes = {
		cases: PropTypes.array,
		activeCase: PropTypes.object,
		periods: PropTypes.array,
		activePeriod: PropTypes.object,
		place: PropTypes.object,
		scopes: PropTypes.array,
		activeScope: PropTypes.object
	};

	constructor(props) {
		super(props);

		this.ref = React.createRef();

		this.state = {
			fixedHeaderOpen: false
		};

		this.onCaseChange = this.onCaseChange.bind(this);
		this.onPeriodChange = this.onPeriodChange.bind(this);
		this.onScopeChange = this.onScopeChange.bind(this);

		window.addEventListener("scroll", this.onWindowScroll.bind(this));
	}

	onWindowScroll(e) {
		const position = e.currentTarget.scrollY;
		const introHeight = this.ref && this.ref.current.offsetHeight;
		const shouldOpenFixedHeader = position > (introHeight - BUFFER);

		if (shouldOpenFixedHeader !== this.state.fixedHeaderOpen) {
			this.setState({
				fixedHeaderOpen: shouldOpenFixedHeader
			});
		}
	}

	onCaseChange(model) {
		this.props.onCaseChange(model.key);
	}

	onPeriodChange(model) {
		this.props.onPeriodChange(model.key);
	}

	onScopeChange(model) {
		this.props.onScopeChange(model.key);
	}

	render() {
		const props = this.props;

		let classes = classnames("tacrAgritas-fixed-header", {
			open: this.state.fixedHeaderOpen
		});

		return (
			<>
				<div className="tacrAgritas-header" ref={this.ref}>
					<div className="tacrAgritas-header-content">
						{props.place ? this.renderTitle() : null}
						{props.cases && props.scopes && props.periods ? this.renderSelections() : null}
					</div>
				</div>
				<div className={classes}>

				</div>
			</>
		);
	}

	renderTitle() {
		return (
			<h1 className="tacrAgritas-title">
				{this.props.place.data.nameDisplay}
			</h1>
		);
	}

	renderSelections() {
		const props = this.props;

		return (
			<div className="tacrAgritas-selections">
				{props.scopes ? this.renderSelection("Monitoring", this.props.scopes, this.props.activeScope, this.onScopeChange) : null}
				{props.periods ? this.renderSelection("Sezóna", this.props.periods, this.props.activePeriod, this.onPeriodChange) : null}
				{props.cases ? this.renderSelection("Plodiny", this.props.cases, this.props.activeCase, this.onCaseChange) : null}
			</div>
		);
	}

	renderSelection(label, options, value, onChange) {
		return (
			<div className="tacrAgritas-header-select-container">
				<Select
					formatOptionLabel={this.formatOptionLabel.bind(this, label)}
					className="tacrAgritas-header-select"
					value={value}
					optionLabel="data.nameDisplay"
					optionValue="key"
					options={options}
					onChange={onChange}
				/>
			</div>
		);
	}

	formatOptionLabel(label, option) {
		return (
			<div>
				<div className="tacrAgritas-header-select-label">{label}</div>
				<div className="tacrAgritas-header-select-value">{option.data.nameDisplay}</div>
			</div>
		);
	}
}

export default Header;
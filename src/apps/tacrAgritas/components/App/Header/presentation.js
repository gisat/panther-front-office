import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import './style.scss';
import Select from "../../../../../components/common/atoms/Select/Select";
import Icon from "../../../../../components/common/atoms/Icon";
import Fade from "react-reveal/Fade";

const BUFFER = 100;

class Header extends React.PureComponent {
	static propTypes = {
		cases: PropTypes.array,
		activeCase: PropTypes.object,
		periods: PropTypes.array,
		activePeriod: PropTypes.object,
		availablePeriods: PropTypes.array,
		place: PropTypes.object,
		scopes: PropTypes.array,
		activeScope: PropTypes.object,
		availableScopes: PropTypes.array
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
					<Fade cascade left distance="50px" duration={500}>
						<div className="tacrAgritas-header-content">
							{props.place ? this.renderTitle() : null}
							{props.cases && props.scopes && props.periods ? this.renderSelections() : null}
						</div>
					</Fade>
				</div>
				<div className={classes}>
					<div className="tacrAgritas-fixed-header-content">
						{props.place ? this.renderTitle() : null}
						{props.cases && props.scopes && props.periods ? this.renderSelections() : null}
					</div>
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
				{props.scopes ? this.renderSelection("Monitoring", this.props.scopes, this.props.availableScopes, this.props.activeScope, this.onScopeChange, "monitoring") : null}
				{props.periods ? this.renderSelection("Sezóna", this.props.periods, this.props.availablePeriods, this.props.activePeriod, this.onPeriodChange, "calendar") : null}
				{props.cases ? this.renderSelection("Plodiny", this.props.cases, this.props.cases, this.props.activeCase, this.onCaseChange, "crop") : null}
			</div>
		);
	}

	renderSelection(label, options, availableOptions, value, onChange, icon) {
		let finalOptions = [];
		options.forEach(option => {
			let available = !!_.find(availableOptions, (availableOption) => availableOption.key === option.key);
			finalOptions.push({
				...option,
				isDisabled: !available
			});
		});


		return (
			<div className="tacrAgritas-header-select-container">
				<Select
					formatOptionLabel={this.formatOptionLabel.bind(this, label, icon)}
					className="tacrAgritas-header-select"
					value={value}
					optionLabel="data.nameDisplay"
					optionValue="key"
					options={finalOptions}
					onChange={onChange}
				/>
			</div>
		);
	}

	formatOptionLabel(label, icon, option) {
		let classes = classnames("tacrAgritas-header-select-value-container", {
			disabled: option.isDisabled
		});

		return (
			<div className={classes}>
				<div className="tacrAgritas-header-select-label">
					<Icon icon={icon}/>
					<div>{label}</div>
				</div>
				<div className="tacrAgritas-header-select-value">{option.data.nameDisplay}</div>
			</div>
		);
	}
}

export default Header;
import React from 'react';
import PropTypes from 'prop-types';
import UISelect from '../../../presentation/atoms/UISelect'
import classNames from 'classnames';
import _ from 'lodash';

let polyglot = window.polyglot;

class PeriodsSelector extends React.PureComponent {

	static propTypes = {
		activeKeys: PropTypes.array,
		activeScope: PropTypes.object,
		isInIntroMode: PropTypes.bool,
		periods: PropTypes.array,
		onChangePeriods: PropTypes.func,
		onScopeChange: PropTypes.func,
		periodKeys: PropTypes.array
	};

	static defaultProps = {
		places: null
	};

	constructor(props) {
		super(props);
		this.onChangePeriods = this.onChangePeriods.bind(this);
	}

	componentDidMount(){
		let scope = this.props.activeScope;
		if (scope && scope.key && !this.props.isInIntroMode){ //TODO remove dependency on mode
			this.props.onScopeChange(scope.data.years, this.props.componentId);
		}
	}

	componentWillReceiveProps(nextProps){
		let scope = this.props.activeScope;
		if (scope && (scope.key !== nextProps.activeScope.key) && !this.props.isInIntroMode){ //TODO remove dependency on mode
			this.props.onScopeChange(scope.data.years, this.props.componentId);
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	onChangePeriods(selected){
		if (_.isArray(selected)){
			if (selected.length > 1){
				let values = selected.map(item => item.key);
				this.props.onChangePeriods(values);
			} else {
				this.props.onChangePeriods(selected[0].key);
			}
		} else {
			this.props.onChangePeriods(selected.key);
		}
	}

	render() {
		let options = [];
		let selected = null;
		let clearableValue = true;

		if (this.props.activeKeys){
			selected = this.props.activeKeys;
		} else if (this.props.activeKey){
			selected = this.props.activeKey;
			clearableValue = false;
		}

		if (this.props.periods){
			this.props.periods.map(period => {
				options.push({
					key: period.key,
					value: period.key,
					label: period.data && period.data.name,
					clearableValue
				})
			});
		}

		let classes = classNames("ptr-periods-selector ptr-view-selection-selector", this.props.classes);
		let content = (
			<UISelect
				key='theme-selector'
				multi={options && options.length > 1}
				clearable={false}
				classes={classes}
				label='left'
				name={polyglot.t('theme')}
				onChange={this.onChangePeriods}
				options={options}
				placeholder=''
				value={selected}
				disabled={!!this.props.disabled}
			/>
		);

		return (
			<div className="ptr-view-selection-container">
				{content}
			</div>
		);
	}

}

export default PeriodsSelector;

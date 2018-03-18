import React from 'react';
import ReactSelect from 'react-select'
import PropTypes from 'prop-types';

import classNames from 'classnames';
import 'react-select/dist/react-select.css';

class UISelect extends React.PureComponent {

	static propTypes = {
		classes: PropTypes.string,
		label: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func,
		options: PropTypes.array,
		placeholder: PropTypes.string
	};

	constructor(props) {
		super();
	}

	render() {
		let classes = classNames(
			'ptr-ui-select ptr-view-selection-selector',
			this.props.classes, {
				'label-left': this.props.label === 'left',
				'label-top': this.props.label === 'top'
			}
		);
		let label;
		if (this.props.label && this.props.name){
			label = this.renderLabel();
		}

		return (
			<div className={classes}>
				{label}
				<ReactSelect
					name={this.props.name}
					onChange={this.props.onChange}
					options={this.props.options}
					placeholder={this.props.placeholder}
				/>
			</div>
		)
	}

	renderLabel(){
		return (
			<div className={'ptr-ui-select-label'}>{this.props.name}</div>
		)
	}
}

export default UISelect;

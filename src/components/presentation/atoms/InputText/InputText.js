import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import './InputText.css';

class InputText extends React.PureComponent {

	static propTypes = {
		extraLarge: PropTypes.bool,
		focus: PropTypes.bool,
		large: PropTypes.bool,
		placeholder: PropTypes.string,
		transparent: PropTypes.bool,
		value: PropTypes.string,
		onChange: PropTypes.func
	};

	constructor(props){
		super(props);
		this.state = {
			value: this.props.value
		};

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			value: nextProps.value
		});
	}

	onChange(e){
		this.setState({
			value: e.target.value
		});
		if (this.props.onChange){
			this.props.onChange(e.target.value);
		}
	}

	onBlur(){
		this.setState({
			focus: false
		});
	}

	onFocus(){
		this.setState({
			focus: true
		});
	}

	render() {
		let classes = classNames("ptr-input-text", {
			'extraLarge': this.props.extraLarge,
			'large': this.props.large,
			'empty': !this.state.value,
			'focus': this.state.focus,
			'transparent': this.props.transparent
		});

		let content = this.renderInput();

		return (
			<div className={classes}>
				{content}
				{this.props.children}
			</div>
		);
	}

	renderInput(){
		return (
			<input type="text"
				   placeholder={this.state.focus ? null : this.props.placeholder}
				   value={this.state.value || ""}
				   onChange={this.onChange}
				   autoFocus={this.state.focus}
				   onBlur={this.onBlur}
				   onFocus={this.onFocus}
			/>);
	}
}

export default InputText;

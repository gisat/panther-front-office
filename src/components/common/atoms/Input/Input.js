import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';

import './Input.scss';
import EditableText from "../EditableText";

class Input extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		focus: PropTypes.bool,
		inverted: PropTypes.bool,
		name: PropTypes.string,
		onChange: PropTypes.func,
		placeholder: PropTypes.string,
		unfocusable: PropTypes.bool,
		value: PropTypes.string
	};

	constructor(props){
		super(props);
		this.state = {
			value: this.props.value
		};

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onChangeMultiline = this.onChangeMultiline.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			value: nextProps.value
		});
	}

	onChange(e){
		if (this.props.hasOwnProperty('value') && this.props.onChange) {
			// controlled
			this.props.onChange(e.target.value);
		} else {
			// uncontrolled
			this.setState({
				value: e.target.value
			});
		}
	}

	onChangeMultiline(value) {
		if (this.props.hasOwnProperty('value') && this.props.onChange) {
			// controlled
			if (value === "") {
				value = null;
			}
			this.props.onChange(value);
		} else {
			// uncontrolled
			this.setState({
				value: value
			});
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
			'empty': !this.state.value,
			'focus': this.state.focus,
			'input': !this.props.multiline,
			'inverted': !!this.props.inverted,
			'multiline': this.props.multiline,
			'disabled': this.props.disabled
		});

		return (
			<div className={classes}>
				{this.props.multiline ? this.renderMultiline() : this.renderInput()}
				{this.props.children}
			</div>
		);
	}

	renderInput(){

		let type = "text";
		if (this.props.password) {
			type = "password"
		} else if (this.props.email) {
			type = "email"
		} else if (this.props.date) {
			type = "date"
		} else if (this.props.number) {
			type = "number"
		}

		return (
			<input type={type}
				disabled={this.props.disabled}
				tabIndex={this.props.unfocusable ? -1 : 0}
				placeholder={this.state.focus ? null : this.props.placeholder}
				value={this.state.value || ""}
				name={this.props.name}
				onChange={this.onChange}
				autoFocus={this.state.focus}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
			/>
		);
	}

	renderMultiline() {

		return (
			<EditableText
				invisible
				disabled={this.props.disabled}
				unfocusable={this.props.unfocusable}
				value={this.state.value || ""}
				name={this.props.name}
				onChange={this.onChangeMultiline}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
			/>
		);

	}
}

export default Input;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import './Input.scss';
import EditableText from "../EditableText";

class Input extends React.PureComponent {

	static propTypes = {
		extraLarge: PropTypes.bool,
		focus: PropTypes.bool,
		large: PropTypes.bool,
		placeholder: PropTypes.string,
		transparent: PropTypes.bool,
		value: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func,
		unfocusable: PropTypes.bool
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
			'extraLarge': this.props.extraLarge,
			'large': this.props.large,
			'empty': !this.state.value,
			'focus': this.state.focus,
			'transparent': this.props.transparent,
			'input': !this.props.multiline,
			'multiline': this.props.multiline
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
				unfocusable={this.props.unfocusable}
				value={this.props.value || this.state && this.state.value || ""}
				name={this.props.name}
				onChange={this.onChangeMultiline}
			/>
		);

	}
}

export default Input;

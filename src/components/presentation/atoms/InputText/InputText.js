import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import './InputText.css';

class InputText extends React.PureComponent {

	static propTypes = {
		disableEditing: PropTypes.bool,
		extraLarge: PropTypes.bool,
		focus: PropTypes.bool,
		multiline: PropTypes.bool,
		large: PropTypes.bool,
		placeholder: PropTypes.string,
		value: PropTypes.string,
		simpleDecoration: PropTypes.bool
	};

	constructor(props){
		super(props);
		this.state = {
			value: this.props.value
		};

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onMultilineClick = this.onMultilineClick.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			value: nextProps.value
		});
	}

	onBlur(){
		if (this.props.multiline){
			this.setState({
				editMultiline: false,
				focus: false
			});
		}
	}

	onChange(e){
		this.setState({
			value: e.target.value
		});
	}

	onFocus(){
		let editMultiline = false;
		if (this.props.multiline){
			editMultiline = true;
		}

		this.setState({
			editMultiline: {editMultiline},
			focus: true
		});
	}

	onMultilineClick(){
		this.setState({
			editMultiline: true,
			focus: true
		});
	}

	render() {
		let classes = classNames("ptr-input-text", {
			'extraLarge': this.props.extraLarge,
			'large': this.props.large,
			'simple-decoration': this.props.simpleDecoration,
			'empty': !this.state.value,
			'uneditable': this.props.disableEditing
		});

		let content = null;
		if (this.props.multiline && !this.state.editMultiline && this.state.value && !this.props.disableEditing){
			content = this.renderParagraph();
		} else if (this.state.value || !this.props.disableEditing){
			content = this.renderInput();
		}

		return (
			<div className={classes}>
				{content}
			</div>
		);
	}

	renderInput(){
		return (
			<input type="text"
				   placeholder={this.props.placeholder}
				   value={this.state.value}
				   onChange={this.onChange}
				   autoFocus={this.state.focus}
				   onFocus={this.onFocus}
				   onBlur={this.onBlur}/>);
	}

	renderParagraph(){
		return (
			<p onClick={this.onMultilineClick}>{this.state.value}</p>
		);
	}
}

export default InputText;

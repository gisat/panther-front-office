import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';

let polyglot = window.polyglot;

const DEFAULT_HEIGHT = 36;

class EditableText extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool,
		required: PropTypes.bool,
		unfocusable: PropTypes.bool
	};

	constructor(props){
		super(props);

		this.state = {
			height: DEFAULT_HEIGHT
		};

		this.ref = this.ref.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	ref(el) {
		this.el = el;
	}

	componentDidMount() {
		this.resize();
	}

	componentWillReceiveProps(nextProps){
		//if (nextProps.value !== this.props.value) {
		//	this.resize();
		//}
	}

	componentDidUpdate() {
		this.resize();
	}

	resize() {
		if (this.el && typeof this.el.scrollHeight != 'undefined') {
			let isHeightDifferent = Math.abs(this.el.scrollHeight - this.state.height) > 2;
			if (isHeightDifferent && this.el.scrollHeight > DEFAULT_HEIGHT) {
				this.setState({
					height: this.el.scrollHeight
				});
			}
		}
	}

	onFocus() {
		this.setState({
			focused: true
		});
		console.log("#####", this.props.onFocus);
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}
	onBlur(){
		this.setState({
			focused: false
		});
		if (this.props.onBlur) {
			this.props.onBlur();
		}
	}

	onChange(e){
		if (this.props.hasOwnProperty('value') && this.props.onChange) {
			// controlled
			console.log('#######', e.target.value);
			this.props.onChange(e.target.value);
		} else {
			// uncontrolled
			this.setState({
				value: e.target.value
			});
		}
	}

	render() {
		let classes = classNames("ptr-editable-text", {
			disabled: this.props.disabled,
			empty: !(this.props.value || this.state && this.state.value),
			large: this.props.large,
			editing: this.props.editing,
			required: this.props.required,
			inverted: this.props.inverted,
			invisible: this.props.invisible
		});

		let value = this.props.value || this.state && this.state.value || '';
		let style = {
			height: value.length ? this.state.height : DEFAULT_HEIGHT
		};

		if (!this.props.disabled) {
			let message = this.renderMessage();

			return (
				<div>
					<textarea
						tabIndex={this.props.unfocusable ? -1 : 0}
						className={classes}
						style={style}
						ref={this.ref}
						value={value}
						placeholder={this.props.placeholder}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
						spellCheck={this.state.focused}
						onChange={this.onChange}
					/>
					{message}
				</div>
			);
		} else {
			return (
				<div className={classes}>
					{this.props.value || this.state && this.state.value || ''}
				</div>
			);
		}
	}

	renderMessage(){
		return ((this.props.required && !(this.props.value || this.state && this.state.value)) ?
			(<div className="ptr-editable-text-message">{polyglot.t('requiredField')}</div>): null);
	}
}

export default EditableText;

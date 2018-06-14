import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import './style.css';

class EditableText extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool
	};

	constructor(props){
		super(props);

		this.state = {
			height: 40
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
			if (this.el.scrollHeight !== this.state.height) {
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
	}
	onBlur(){
		this.setState({
			focused: false
		});
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
			editing: this.props.editing
		});

		let style = {
			height: this.state.height
		};

		if (!this.props.disabled) {
			return (
				<textarea
					className={classes}
					style={style}
					ref={this.ref}
					value={this.props.value || this.state && this.state.value || ''}
					placeholder={this.props.placeholder}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					spellCheck={this.state.focused}
					onChange={this.onChange}
				/>
			);
		} else {
			return (
				<div className={classes}>
					{this.props.value || this.state && this.state.value || ''}
				</div>
			);
		}
	}
}

export default EditableText;

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
			height: 0
		};

		this.ref = this.ref.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
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
		this.setState({
			value: e.target.value
		});
	}

	render() {
		let classes = classNames("ptr-editable-text", {
			disabled: this.props.disabled
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
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					spellCheck={this.state.focused}
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

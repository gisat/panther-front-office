import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
import _ from 'lodash';

import './style.css';

class InputFile extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool
	};

	constructor(props){
		super(props);

		this.state = {
			file: null
		};

		this.onChange = this.onChange.bind(this);
	}

	onChange(e){
		if (this.props.hasOwnProperty('value') && this.props.onChange) {
			// controlled
			this.props.onChange(e.target.files[0]);
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
			empty: !(this.props.value || this.state && this.state.value)
		});

		return (
			<input
				type="file"
				className={classes}
				filename={this.props.value || this.state && this.state.value || ''}
				placeholder={this.props.placeholder}
				onChange={this.onChange}
				accept={this.props.accept}
			/>
		);
	}
}

export default InputFile;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from "panther-utils"
import _ from 'lodash';

import './style.css';

class InputFile extends React.PureComponent {

	static propTypes = {
		accept: PropTypes.string,
		buttonText: PropTypes.string,
		inputId: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func
	};

	constructor(props){
		super(props);

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

	componentWillReceiveProps(nextProps){
	}

	onBlur(){

	}

	onChange(e){
		this.props.onChange(e);
	}

	onFocus(){

	}

	render() {
		let classes = classNames("ptr-inputFile", {
		});

		return (
			<div className={classes}>
				<input
					accept={this.props.accept}
					onChange={this.onChange}
					type="file" name={this.props.name}
					id={this.props.inputId}
					className="ptr-inputFile-input"/>
				<label htmlFor={this.props.inputId}>
					{this.props.children}
					</label>
			</div>
		);
	}
}

export default InputFile;
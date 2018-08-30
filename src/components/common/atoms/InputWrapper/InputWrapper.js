import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import './style.css';

class InputWrapper extends React.PureComponent {

	static propTypes = {
		divInsteadOfLabel: PropTypes.bool,
		disabled: PropTypes.bool,
		label: PropTypes.string,
		required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
	};

	render() {
		let classes = classNames("ptr-input-wrapper", this.props.className, {
			'disabled': this.props.disabled
		});

		let info = this.props.info ? (<div className="ptr-input-wrapper-info">{this.props.info}</div>) : null;
		let children = React.Children.map(this.props.children, child => {
			if (typeof child === 'object' && child.type === InputWrapperInfo) {
				info = child;
				return null;
			}
			return child;
		});

		let required = this.props.required ? (<div className="ptr-input-wrapper-required">{this.props.required.length ? this.props.required : "Required"}</div>) : null;

		return this.props.divInsteadOfLabel ? (
			<div className={classes}>
				<div>
					{required}
					{this.props.label ? <span>{this.props.label}</span> : null}
					{children}
				</div>
				{info}
			</div>
		) : (
			<div className={classes}>
				<label>
					{required}
					<span>{this.props.label}</span>
					{children}
				</label>
				{info}
			</div>
		);
	}
}

export default InputWrapper;

export const InputWrapperInfo = props => {

	return (
		<div
			className="ptr-input-wrapper-info"
		>
			{props.children}
		</div>
	);
};

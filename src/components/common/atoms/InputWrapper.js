import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../utils/utils';
import _ from 'lodash';

class InputWrapper extends React.PureComponent {

	static propTypes = {
		disabled: PropTypes.bool
	};

	render() {
		let classes = classNames("ptr-input-wrapper", this.props.className, {
			'disabled': this.props.disabled
		});

		let info = null;
		let children = React.Children.map(this.props.children, child => {
			if (typeof child === 'object' && child.type === InputWrapperInfo) {
				info = child;
				return null;
			}
			return child;
		});

		return (
			<div className={classes}>
				<label>
					<span>{this.props.label}</span>
					{children}
					{info}
				</label>
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

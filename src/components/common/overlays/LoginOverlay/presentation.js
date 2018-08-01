import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';

import Button from '../../../presentation/atoms/Button';


class LoginOverlay extends React.PureComponent {

	static propTypes = {

	};

	render() {

		return (
			<div className={classNames("ptr-login-overlay", "ptr-overlay", {open: this.props.open})}>
				LOGIN
			</div>
		);

	}
}

export default LoginOverlay;

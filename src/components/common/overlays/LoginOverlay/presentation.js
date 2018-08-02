import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';

import Button from '../../../presentation/atoms/Button';
import InputText from '../../../presentation/atoms/InputText/InputText';


class LoginOverlay extends React.PureComponent {

	static propTypes = {

	};

	render() {

		return (
			<div className={classNames("ptr-login-overlay", "ptr-overlay", "ptr-overlay-fix", {open: this.props.open})}>
				<div className="ptr-login">
					<div>
						<InputText
							email
							transparent
							placeholder="e-mail"
						/>
					</div>
					<div>
						<InputText
							password
							transparent
							placeholder="passphrase"
						/>
					</div>
					<div>
						<Button
							primary
							onClick={this.props.login}
						>
							Log in
						</Button>
						<Button
							invisible
							inverted
							onClick={this.props.close}
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		);

	}
}

export default LoginOverlay;

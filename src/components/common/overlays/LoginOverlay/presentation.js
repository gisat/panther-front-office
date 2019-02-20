import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';

import Button from '../../atoms/Button';
import InputText from '../../atoms/Input/Input';

let polyglot = window.polyglot;

class LoginOverlay extends React.PureComponent {

	static propTypes = {
		open: PropTypes.bool,
		loginRequired: PropTypes.bool
	};

	constructor() {
		super();

		this.state = {
			email: '',
			password: ''
		};

		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.login = this.login.bind(this);
	}

	onChangeEmail(value){
		this.setState({
			email: value
		});
	}

	onChangePassword(value) {
		this.setState({
			password: value
		});
	}

	login(){
		this.props.login(this.state.email, this.state.password);
	}

	render() {

		return (
			<div className={classNames("ptr-login-overlay", "ptr-overlay", "ptr-dark", "ptr-overlay-fix", {open: this.props.open})}>
				<div className="ptr-login">
					<div>
						<InputText
							email
							transparent
							placeholder="e-mail"
							onChange={this.onChangeEmail}
							value={this.state.email}
						/>
					</div>
					<div>
						<InputText
							password
							transparent
							placeholder={polyglot.t('passphrase')}
							onChange={this.onChangePassword}
							value={this.state.password}
						/>
					</div>
					<div>
						<Button
							primary
							onClick={this.login}
						>
							{polyglot.t('logIn')}
						</Button>
						{!this.props.loginRequired ? (
							<Button
								invisible
								inverted
								onClick={this.props.close}
							>
								{polyglot.t('cancel')}
							</Button>
						) : null}
					</div>
				</div>
			</div>
		);

	}
}

export default LoginOverlay;

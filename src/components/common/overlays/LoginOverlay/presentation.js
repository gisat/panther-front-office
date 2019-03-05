import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';

import Button from '../../../presentation/atoms/Button';
import InputText from '../../../presentation/atoms/Input/Input';

let polyglot = window.polyglot;

class LoginOverlay extends React.PureComponent {

	static propTypes = {
		eossoLogin: PropTypes.bool,
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
			<div className={classNames("ptr-login-overlay", "ptr-overlay", "ptr-overlay-fix", {open: this.props.open})}>
				{this.props.eossoLogin ? this.renderEossoLogin() : null}
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
							primary={!this.props.eossoLogin}
							inverted={this.props.eossoLogin}
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

	renderEossoLogin() {
		return (
			<div className="ptr-login-eosso">
				<a className="ptr-button primary large" href="https://urban-tep.eu/umsso?r=https%3A%2F%2Furban-tep.eu%2Fpuma%2Ftool" target="_blank">{polyglot.t('loginViaEosso')}</a>
				<a className="ptr-button inverted large" href="https://eo-sso-idp.eo.esa.int/idp/umsso20/registration" target="_blank">{polyglot.t('signup')}</a>
				<div className="ptr-login-divider">{polyglot.t('orUseInternalLogin')}</div>
			</div>
		);
	}
}

export default LoginOverlay;

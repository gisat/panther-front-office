import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';

import Button from '../../atoms/Button';
import InputText from '../../atoms/Input/Input';
import {withNamespaces} from "react-i18next";

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
		const t = this.props.t;

		return (
			<div className={classNames("ptr-login-overlay", "ptr-overlay", "ptr-dark", "ptr-overlay-fix", {open: this.props.open})}>
				<div className="ptr-login">
					<div>
						<InputText
							email
							transparent
							placeholder="E-mail"
							onChange={this.onChangeEmail}
							value={this.state.email}
						/>
					</div>
					<div>
						<InputText
							password
							transparent
							placeholder={t('user.passphrase')}
							onChange={this.onChangePassword}
							value={this.state.password}
						/>
					</div>
					<div>
						<Button
							primary
							onClick={this.login}
						>
							{t("user.login")}
						</Button>
						{!this.props.loginRequired ? (
							<Button
								invisible
								inverted
								onClick={this.props.close}
							>
								{t('cancelCapitalized')}
							</Button>
						) : null}
					</div>
				</div>
			</div>
		);

	}
}

export default withNamespaces()(LoginOverlay);

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.css';

import {Button, Input} from '@gisatcz/ptr-atoms';
import {withNamespaces} from "react-i18next";

class LoginOverlay extends React.PureComponent {

	static propTypes = {
		onClose: PropTypes.func,
		onLogin: PropTypes.func,
		open: PropTypes.bool,
		opening: PropTypes.bool,
		loginRequired: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			open: false
		};

		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.cancel = this.cancel.bind(this);
		this.login = this.login.bind(this);
	}

	componentDidMount() {
		if (this.props.opening) {
			let self = this;
			setTimeout(() => {
				self.setState({open: true});
			},10);
		}
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
		this.props.onLogin(this.state.email, this.state.password);
		this.closeOverlay();
	}

	cancel() {
		this.closeOverlay();
	}

	closeOverlay() {
		this.setState({
			open: false
		});

		if (this.props.onClose) {
			let self = this;
			setTimeout(() => {
				self.props.onClose();
			}, 350);
		}
	}

	render() {
		const t = this.props.t;

		return (
			<div className={classNames("ptr-login-overlay", {open: this.state.open || this.props.open})}>
				<div className="ptr-login">
					<div>
						<Input
							inverted
							email
							transparent
							placeholder="E-mail"
							onChange={this.onChangeEmail}
							value={this.state.email}
						/>
					</div>
					<div>
						<Input
							inverted
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
								onClick={this.cancel}
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

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.scss';

import Button from '../../atoms/Button';
import Menu, {MenuItem} from '../../atoms/Menu';
import {withNamespaces} from "react-i18next";

class User extends React.PureComponent {

	static propTypes = {
		user: PropTypes.object,
		inverted: PropTypes.bool
	};

	render() {
		let t = this.props.t;
		let user = this.props.user;

		if (user) {
			let name = user.data.name || user.data.email;

			return (
				<div className="ptr-user">
					<div className="ptr-user-image"></div>
					<div className="ptr-user-name">{name}</div>
					<div className="ptr-user-options">
						<Button icon="dots" invisible inverted={this.props.inverted}>
							<Menu bottom left>
								<MenuItem onClick={this.props.logout}>{t("user.logout")}</MenuItem>
							</Menu>
						</Button>
					</div>
				</div>
			);

		} else {
			// It means render another component.
			return (
				<div className="ptr-user">
					<div className="ptr-user-login">
						<Button invisible inverted={this.props.inverted} onClick={this.props.login}>{t("user.login")}</Button>
					</div>
				</div>
			);

		}

	}
}

export default withNamespaces()(User);

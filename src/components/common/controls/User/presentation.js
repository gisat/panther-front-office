import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';

import Button from '../../../presentation/atoms/Button';
import Menu, {MenuItem} from '../../../presentation/atoms/Menu';


class User extends React.PureComponent {

	static propTypes = {
		user: PropTypes.object
	};

	render() {

		if (this.props.user) {

			return (
				<div className="ptr-user">
					<div className="ptr-user-image"></div>
					<div className="ptr-user-name">{this.props.user.name}</div>
					<div className="ptr-user-options">
						<Button icon="dots" invisible>
							<Menu bottom left>
								<MenuItem onClick={this.props.logout}>Log out</MenuItem>
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
						<Button invisible inverted onClick={this.props.login}>Log in</Button>
					</div>
				</div>
			);

		}

	}
}

export default User;
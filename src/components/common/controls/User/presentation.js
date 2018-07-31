import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import Names from '../../../../constants/Names'

import './style.css';


class User extends React.PureComponent {

	static propTypes = {
		user: PropTypes.object
	};

	render() {

		if (this.props.user) {

			return (
				<div>
					{this.props.user.name}
				</div>
			);

		} else {

			return (
				<div>
					login
				</div>
			);

		}

	}
}

export default User;

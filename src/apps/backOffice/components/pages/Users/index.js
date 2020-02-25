import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from '@gisatcz/ptr-locales';
import Helmet from "react-helmet";

import './style.scss';

class UsersPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {
		
		return (
			<div className="ptr-base-page">
				<Helmet><title>Users</title></Helmet>
				Users! Groups! Permissions!
			</div>
		);
	}
}

export default withNamespaces()(UsersPage);
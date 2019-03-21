import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";

import './style.scss';

class UsersPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {
		
		return (
			<div className="ptr-base-page">
				Users! Groups! Permissions!
			</div>
		);
	}
}

export default withNamespaces()(UsersPage);
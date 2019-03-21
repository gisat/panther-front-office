import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";
import Helmet from "react-helmet";

import './style.scss';

class AppsPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {

		return (
			<div className="ptr-base-page">
				<Helmet><title>Apps</title></Helmet>
				Apps! Scopes!
			</div>
		);
	}
}

export default withNamespaces()(AppsPage);
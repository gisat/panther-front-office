import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";

import './style.scss';

class PlacesPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {

		return (
			<div className="ptr-base-page">
				Places!
			</div>
		);
	}
}

export default withNamespaces()(PlacesPage);
import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from '@gisatcz/ptr-locales';

import './style.scss';

class DashboardPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {

		return (
			<div className="ptr-base-page">
				Dashboard!
			</div>
		);
	}
}

export default withNamespaces()(DashboardPage);
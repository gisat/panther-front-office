import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from '@gisatcz/ptr-locales';
import Helmet from "react-helmet";

import './style.scss';

class SpatialDataSourcesPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {

		return (
			<div className="ptr-base-page">
				<Helmet><title>Spatial Data Sources</title></Helmet>
				Spatial data sources! Relations! Such data!
			</div>
		);
	}
}

export default withNamespaces()(SpatialDataSourcesPage);
import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from '@gisatcz/ptr-locales';
import Helmet from "react-helmet";

import './style.scss';

class AttributeDataSourcesPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {

		return (
			<div className="ptr-base-page">
				<Helmet><title>Attribute Data Sources</title></Helmet>
				Attribute data sources! Relations! Very data!
			</div>
		);
	}
}

export default withNamespaces()(AttributeDataSourcesPage);
import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import LayerTemplatesList from "../../lists/LayerTemplatesList";
import ScopesList from "../../lists/ScopesList";
import NavList from '../../../../../components/presentation/NavList'

import './style.scss';

class SpatialDataSourcesPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {

		return (
			<div className="ptr-base-page">
				Spatial data sources! Relations! Such data!
			</div>
		);
	}
}

export default withNamespaces()(SpatialDataSourcesPage);
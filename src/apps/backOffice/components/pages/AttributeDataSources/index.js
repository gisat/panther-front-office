import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import LayerTemplatesList from "../../lists/LayerTemplatesList";
import ScopesList from "../../lists/ScopesList";
import NavList from '../../../../../components/presentation/NavList'

import './style.scss';

class AttributeDataSourcesPage extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	render() {

		return (
			<div className="ptr-base-page">
				Attribute data sources! Relations! Very data!
			</div>
		);
	}
}

export default withNamespaces()(AttributeDataSourcesPage);
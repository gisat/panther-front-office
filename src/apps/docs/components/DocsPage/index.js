import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import NavList from '../../../../components/presentation/NavList';

import './style.scss';
import ButtonDoc from "../ButtonDoc";
import InputDoc from "../InputDoc";
import InputWrapperDoc from "../InputWrapperDoc";
import SelectDoc from "../SelectDoc";
import TypoDoc from "../TypoDoc";
import FadeInDoc from "../FadeInDoc";
import MultiSelectDoc from "../MultiSelectDoc";
import ColumnChartDoc from "../ColumnChartDoc";

class DocsPage extends React.PureComponent {

	constructor(props) {
		super(props);

		this.components = [
			{key: 'button', title: 'Button', component: ButtonDoc},
			{key: 'fadeIn', title: 'FadeIn', component: FadeInDoc},
			{key: 'input', title: 'Input', component: InputDoc},
			{key: 'inputWrapper', title: 'InputWrapper', component: InputWrapperDoc},
			{key: 'multiSelect', title: 'MultiSelect', component: MultiSelectDoc},
			{key: 'select', title: 'Select', component: SelectDoc},
			{key: 'typo', title: 'Typography', component: TypoDoc},
			{key: 'columnChart', title: 'Column Chart', component: ColumnChartDoc, props: {unresponsive: true}},
		];

		this.paths = {};
		this.components.forEach(component => {
			this.paths[component.key] = `${this.props.match.path}${component.key}`;
		});

		this.navList = [
			{
				title: 'Components',
				type: 'folder',
				items: this.components.map(component => {
					return {
						type: 'leaf',
						title: component.title,
						path: this.paths[component.key]
					}
				})
			}
		];
	}

	render() {
		const location = this.props.match.path;

		return (
			<div className="ptr-docs-page">
				<div className="ptr-docs-nav ptr-light">
					<NavList items={this.navList} location={location}/>
				</div>
				{this.renderRoutes()}
			</div>
		);
	}

	renderRoutes() {
		return (
			<Switch>
				{this.components.map(component => {
					return (
						<Route
							key={component.key}
							path={this.paths[component.key]}
							render={() => this.renderPage(component.title, component.component, component.props)}
						/>);
				})}
			</Switch>
		);
	}

	renderPage(title, component, props) {
		let classes = classnames("ptr-docs-content",{
			unresponsive: props.unresponsive
		});

		return (
			<div className={classes}>
				<div className="ptr-docs-panel ptr-light">
					<div>
						<h1>{title}</h1>
						{React.createElement(component)}
					</div>
				</div>
				<div className="ptr-docs-panel ptr-dark">
					<div>
						<h1>{title}</h1>
						{React.createElement(component)}
					</div>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(DocsPage);
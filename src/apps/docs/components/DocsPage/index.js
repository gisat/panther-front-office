import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {withNamespaces} from '@gisatcz/ptr-locales';
import {Route, Switch} from "react-router";
import NavList from '../../../../components/presentation/NavList';
import _ from 'lodash';

import './style.scss';
import ButtonDoc from "../ButtonDoc";
import InputDoc from "../InputDoc";
import InputWrapperDoc from "../InputWrapperDoc";
import SelectDoc from "../SelectDoc";
import TypoDoc from "../pages/design/Typography";
import FadeInDoc from "../FadeInDoc";
import MultiSelectDoc from "../MultiSelectDoc";
import ColumnChartDoc from "../ColumnChartDoc";
import LineChartDoc from "../LineChartDoc";
import AsterChartDoc from "../AsterChartDoc";
import ScatterChartDoc from "../ScatterChartDoc";
import WorldWindMapDoc from "../WorldWindMapDoc";

class DocsPage extends React.PureComponent {

	constructor(props) {
		super(props);

		this.components = {
			components: [
				{key: 'button', title: 'Button', component: ButtonDoc},
				{key: 'fadeIn', title: 'FadeIn', component: FadeInDoc},
				{key: 'input', title: 'Input', component: InputDoc},
				{key: 'inputWrapper', title: 'InputWrapper', component: InputWrapperDoc},
				{key: 'multiSelect', title: 'MultiSelect', component: MultiSelectDoc},
				{key: 'select', title: 'Select', component: SelectDoc},
				{key: 'typo', title: 'Typography', component: TypoDoc},
				{key: 'wwmap', title: 'World wind map', component: WorldWindMapDoc, singlePage: true},
			],
			charts: [
				{key: 'asterChart', title: 'Aster Chart', component: AsterChartDoc, props: {forceColumns: true}},
				{key: 'columnChart', title: 'Column Chart', component: ColumnChartDoc, props: {forceColumns: true}},
				{key: 'lineChart', title: 'Line Chart', component: LineChartDoc, props: {forceColumns: true}},
				{key: 'scatterChart', title: 'Scatter Chart', component: ScatterChartDoc, props: {forceColumns: true}},
			]
		};

		this.paths = {};
		_.forIn(this.components, (items) => {
			_.each(items, (item) => {
				this.paths[item.key] = `${this.props.match.path}${item.key}`;
			});
		});

		this.navList = [
			{
				title: 'Components',
				type: 'folder',
				items: this.components.components.map(component => {
					return {
						type: 'leaf',
						title: component.title,
						path: this.paths[component.key]
					}
				})
			}, {
				title: 'Charts',
				type: 'folder',
				items: this.components.charts.map(component => {
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
		let routes = [];
		_.forIn(this.components, (items) => {
			_.map(items, (item) => {
				routes.push (
					<Route
						key={item.key}
						path={this.paths[item.key]}
						render={() => this.renderPage(item.title, item.component, item.props, item.singlePage)}
					/>)
			});
		});

		return (
			<Switch>
				{routes}
			</Switch>
		);
	}

	renderPage(title, component, props, singlePage) {
		let classes = classnames("ptr-docs-content",{
			forceColumns: props && props.forceColumns
		});

		return (
			<div className={classes}>
				{
					singlePage ? (
						<div className="ptr-docs-panel ptr-light">
							<div>
								<h1>{title}</h1>
								{React.createElement(component)}
							</div>
						</div>
					) : (
					<>
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
					</>
					)
				}
			</div>
		);
	}
}

export default withNamespaces()(DocsPage);
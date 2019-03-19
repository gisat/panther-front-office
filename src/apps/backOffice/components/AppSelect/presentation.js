import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import Icon from '../../../../components/common/atoms/Icon';

import './style.scss';
import utils from "../../../../utils/utils";

class AppSelect extends React.PureComponent {

	static propTypes = {
		apps: PropTypes.object,
		storeApps: PropTypes.object,
		activeKey: PropTypes.string,
		onChange: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.onSelectClick = this.onSelectClick.bind(this);
		this.renderApp = this.renderApp.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	merge(apps, storeApps) {
		return storeApps && Object.keys(storeApps).length && apps.map(app => {return {...app, ...storeApps[app.key]}}) || apps;
	}

	onSelectClick(e) {
		this.setState({
			open: !this.state.open
		});
	}

	onItemClick(appKey) {
		if (appKey !== this.props.activeKey) {
			this.props.onChange(appKey);
		}
	}

	render() {
		let apps = this.merge(this.props.apps, this.props.storeApps);
		let activeApp = _.find(apps, {key: this.props.activeKey});
		let selectStyle = activeApp ? {background: utils.stringToColours(activeApp.key, 1, {lightness: [30,40]})} : null;

		return (
			<>
				<div className="ptr-bo-app-select-current ptr-bo-app-select-item" tabIndex="0" onClick={this.onSelectClick}>
					<span>All apps</span><Icon icon="triangle-down"/>
				</div>
				<div className={classNames("ptr-bo-app-select-list", {open: this.state.open})}><div><div>
					{apps && apps.length && apps.map(this.renderApp) || null}
				</div></div></div>
			</>
		);
	}

	renderApp(app) {
		if (app.backOffice) {
			return null;
		} else {
			let style = {
				background: app.data && app.data.color || utils.stringToColours(app.key, 1, {lightness: [30,40]})
			};
			return (
				<div className="ptr-bo-app-select-item" style={style} onClick={this.onItemClick.bind(this, app.key)}>
					<span>{app.data && app.data.name || app.key}</span>
				</div>
			);
		}
	}

}

export default AppSelect;


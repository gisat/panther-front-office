import React from 'react';
import classNames from 'classnames';

import Icon from '../../../../components/common/atoms/Icon';

import './style.scss';
import utils from "../../../../utils/utils";

class AppSelect extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.onSelectClick = this.onSelectClick.bind(this);
	}

	onSelectClick(e) {
		this.setState({
			open: !this.state.open
		});
	}

	render() {
		return (
			<>
				<div className="ptr-bo-app-select-current ptr-bo-app-select-item" tabIndex="0" onClick={this.onSelectClick}>
					<span>All apps</span><Icon icon="triangle-down"/>
				</div>
				<div className={classNames("ptr-bo-app-select-list", {open: this.state.open})}><div><div>
					{this.props.apps && this.props.apps.length && this.props.apps.map(this.renderApp) || null}
				</div></div></div>
			</>
		);
	}

	renderApp(app) {
		if (app.backOffice) {
			return null;
		} else {
			let style = {
				background: utils.stringToColours(app.key, 1, {lightness: [30,40]})
			};
			return (
				<div className="ptr-bo-app-select-item" style={style}>
					<span>{app.nameDisplay || app.key}</span>
				</div>
			);
		}
	}

}

export default AppSelect;


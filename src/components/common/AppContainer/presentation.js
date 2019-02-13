import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import LoginOverlay from "../overlays/LoginOverlay";

class AppContainer extends React.PureComponent {

	static propTypes = {
		activeUser: PropTypes.object,
		loginRequired: PropTypes.bool
	};

	render() {
		return (
			<div className="ptr-app-container">
				{this.renderContent()}
			</div>
		);
	}

	renderContent() {
		if (this.props.loginRequired && !this.props.activeUser) {
			return (<LoginOverlay open loginRequired/>);
		} else {
			return (this.props.children);
		}
	}
}

export default AppContainer;

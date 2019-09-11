import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import LoginOverlay from "../overlays/LoginOverlay/presentation";

class AppContainer extends React.PureComponent {

	static propTypes = {
		activeUser: PropTypes.object,
		loginRequired: PropTypes.bool,
		light: PropTypes.bool,
		dark: PropTypes.bool,

		onLoginOverlayClose: PropTypes.func
	};

	render() {

		let classes = classNames(this.props.appKey, {
			'ptr-light': this.props.light || !this.props.dark,
			'ptr-dark': this.props.dark
		});

		return (
			<div id="ptr-app" key="ptr-app" className={classes}>
				{this.renderContent()}
			</div>
		);
	}

	renderContent() {
		let loginOverlay = this.renderLoginOverlay();

		if (this.props.loginRequired && !this.props.activeUser) {
			return (
				<LoginOverlay
					open
					loginRequired
					onLogin={this.props.onLogIn}
				/>
			)
		}  else {
			return (
				<>
					{loginOverlay}
					{this.props.children}
				</>
			)
		}
	}

	renderLoginOverlay() {
		 if (this.props.loginOverlayOpen) {
			return (
				<LoginOverlay
					onLogin={this.props.onLogIn}
					onClose={this.props.onLoginOverlayClose}
					opening
				/>
			);
		} else {
			return null;
		}
	}
}

export default AppContainer;

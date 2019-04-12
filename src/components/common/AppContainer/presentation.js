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

		onLoginOverlayCancel: PropTypes.func
	};

	render() {

		let classes = classNames({
			'ptr-light': this.props.light || !this.props.dark,
			'ptr-dark': this.props.dark
		});

		return (
			<div id="ptr-app" className={classes}>
				{this.renderContent()}
			</div>
		);
	}

	renderContent() {
		if (this.props.loginRequired && !this.props.activeUser) {
			return (
				<LoginOverlay
					open
					loginRequired
					onLogin={this.props.onLogIn}
				/>
			);
		} else if (this.props.loginOverlayOpen) {
			return (
				<>
					<LoginOverlay
						onLogin={this.props.onLogIn}
						onCancel={this.props.onLoginOverlayCancel}
						opening
					/>
					{this.props.children}
				</>
			);
		} else {
			return (this.props.children);
		}
	}
}

export default AppContainer;

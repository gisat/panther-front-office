import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import Names from "../../../../constants/Names";

import ScopeIntroSwitch from '../../../containers/ScopeIntroSwitch';
import User from '../../../common/controls/User';

import './ViewsOverlay.css';

class ViewsOverlay extends React.PureComponent {

	static propTypes = {
		active: PropTypes.bool,
		open: PropTypes.bool,
		intro: PropTypes.object,
		selectScope: PropTypes.func,
		selectedScope: PropTypes.object
	};

	constructor(props){
		super(props);
		this.selectScope = this.selectScope.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.scopes && nextProps.selectedScope){
			let selectedScope = _.find(nextProps.scopes, (scope) => {
				return scope.key === nextProps.selectedScope.key
			});
			if (!selectedScope){
				this.selectScope(null);
			}
		}
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}


	selectScope(key){
		this.props.selectScope(key);
	}

	render() {
		let classes = classNames('ptr-overlay ptr-overlay-views opaque', {
			'open': this.props.open
		});

		let about = this.props.intro ? this.renderAboutItem() : null;
		let firstScope = this.props.scopes && this.props.scopes.length ? this.props.scopes[0] : null;
		let selectedScope = this.props.selectedScope ? this.props.selectedScope : (this.props.intro ? null : firstScope);
		let scopeKey = selectedScope ? selectedScope.key : null;
		let scopes = this.renderScopes(selectedScope);

		if (this.props.active) {
			return (
				<div className={classes}>
					<div className="ptr-overlay-views-top-bar">
						<div className="ptr-overlay-views-top-bar-header">

						</div>
						<div className="ptr-overlay-views-top-bar-user">
							<User />
						</div>
					</div>
					<div className="ptr-overlay-views-content">
						<div className="scopes-list">
							{about}
							{scopes}
						</div>
						<div className="scope-intro-box">
							<ScopeIntroSwitch
								scopeKey={scopeKey}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}

	}

	renderScopes(selectedScope){
		return this.props.scopes.map(scope => {
			let classes = classNames("scopes-list-item", {
				"active": selectedScope ? (scope.key === selectedScope.key) : false
			});
			return <div key={scope.key} className={classes} onClick={this.selectScope.bind(this, scope.key)}>{scope.data.name}</div>
		});
	}

	renderAboutItem(){
		let classes = classNames("scopes-list-item", {
			"active": !this.props.selectedScope
		});
		return <div className={classes} onClick={this.selectScope.bind(this, null)}>{this.props.intro.name}</div>
	}
}

export default ViewsOverlay;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Names from "../../../../constants/Names";

import ScopeIntroSwitch from '../../../containers/controls/ScopeIntroSwitch';

import ViewsList from "../../../containers/controls/ViewsList";

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

		return (
			this.props.active ? (<div className={classes}>
				<div className="scopes-list">
					{about}
					{scopes}
				</div>
				<div className="scope-intro-box">
					<ScopeIntroSwitch
						scopeKey={scopeKey}
					/>
				</div>
			</div>) : null
		);
	}

	renderScopes(selectedScope){
		return this.props.scopes.map(scope => {
			let classes = classNames("scopes-list-item", {
				"active": selectedScope ? (scope.key === selectedScope.key) : false
			});
			return <div key={scope.key} className={classes} onClick={this.selectScope.bind(this, scope.key)}>{scope.name}</div>
		});
	}

	renderAboutItem(){
		let classes = classNames("scopes-list-item", {
			"active": !this.props.selectedScope
		});
		return <div className={classes} onClick={this.selectScope.bind(this, null)}>{Names.VIEWS_OVERLAY_INTRO_ITEM_NAME}</div>
	}
}

export default ViewsOverlay;

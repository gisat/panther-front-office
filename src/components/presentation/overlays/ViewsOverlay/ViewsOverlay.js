import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import Names from "../../../../constants/Names";
import './ViewsOverlay.css';

class ViewsOverlay extends React.PureComponent {

	static propTypes = {
		open: PropTypes.bool,
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

		let scopes = this.renderScopes();

		return (
			<div className={classes}>
				<div className="scopes-list">
					{scopes}
				</div>
				<div className="scope-dataviews-container">
					<h2>{this.props.selectedScope ? this.props.selectedScope.name : null}</h2>
				</div>
			</div>
		);
	}

	renderScopes(){
		return this.props.scopes.map(scope => {
			let classes = classNames("scopes-list-item", {
				"active": this.props.selectedScope ? (scope.key === this.props.selectedScope.key) : false
			});
			return <div key={scope.key} className={classes} onClick={this.selectScope.bind(this, scope.key)}>{scope.name}</div>
		});
	}
}

export default ViewsOverlay;

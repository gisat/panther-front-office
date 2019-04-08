import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import ScopeIntroSwitch from '../../../containers/ScopeIntroSwitch';
import User from '../../../common/controls/User';

import './ViewsOverlay.css';
let polyglot = window.polyglot;

class ViewsOverlay extends React.PureComponent {

	static propTypes = {
		active: PropTypes.bool,
		open: PropTypes.bool,
		intro: PropTypes.object,
		selectScope: PropTypes.func,
		selectedScope: PropTypes.object,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func
	};

	constructor(props){
		super(props);
		this.selectScope = this.selectScope.bind(this);
	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.scopes && nextProps.selectedScope){
			let scopes = _.flatten(_.values(nextProps.scopes));

			let selectedScope = _.find(scopes, (scope) => {
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
		let manage = this.props.currentUser ? this.renderManage(): null;
		let firstScope = this.props.scopes && this.props.scopes.length ? this.props.scopes[0][0] : null;
		let selectedScope = this.props.selectedScope ? this.props.selectedScope : (this.props.intro ? null : firstScope);
		let scopeKey = selectedScope ? selectedScope.key : null;
		let scopes = this.renderScopes(selectedScope);

		let styles = {
			paddingRight: "5px"
		};
		if (this.props.active) {
			return (
				<div className={classes}>
					<div className="ptr-overlay-views-top-bar">
						<div className="ptr-overlay-views-top-bar-header">
							<a className="utep-link" href="/geobrowser/?id=portfolio">
								<img src="images/utep/urban_geobrowser.png" width="30px" height="30px" style={styles}/>
							</a>
							<a className="utep-link" href="/puma/tool">
								<img src="images/utep/urban_data.png" width="30px" height="30px" style={styles} />
							</a>
							<a className="utep-link" href="/geobrowser/?id=eoservices">
								<img src="images/utep/urban_eoservices.png" width="30px" height="30px" style={styles} />
							</a>
							<a className="utep-link" href="/#!communities">
								<img src="images/utep/urban_community_hub.png" width="30px" height="30px" style={styles} />
							</a>
						</div>
						<div className="ptr-overlay-views-top-bar-user">
							<User />
						</div>
					</div>
					<div className="ptr-overlay-views-content">
						<div className="scopes-list">
							{about}
							{manage}
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

	renderScopes(selectedScope) {
		let groups = Object.keys(this.props.scopes);

		let containsUrbanTep = groups.indexOf('Urban TEP') !== -1;
		let containsEO4SD = groups.indexOf('EO4SD Urban') !== -1;
		let containsOthers = groups.indexOf('Other') !== -1;
		let otherGroups = groups.filter(group => {
			return group != "Urban TEP" && group != "Other" && group != "EO4SD Urban" && group != 0;
		});

		groups = [];
		if(containsUrbanTep) {
			groups.push("Urban TEP");
		}
		if(containsEO4SD) {
			groups.push("EO4SD Urban");
		}
		groups = groups.concat(otherGroups);
		if(containsOthers) {
			groups.push('Other');
		}

		return groups.map(group => {
			return (
				<div className="group">
					<div className="group-title">{group}</div>
					{this.props.scopes[group].map(scope => {
					let classes = classNames("scopes-list-item", {
						"active": selectedScope ? (scope.key === selectedScope.key) : false
					});
					return <div key={scope.key} className={classes} onClick={this.selectScope.bind(this, scope.key)}>{scope.data.name}</div>
				})}
				</div>);
		});
	}

	renderManage() {
		let classes = classNames("scopes-list-item");
		return <div className={classes} ><a href="/puma/backoffice/">Manage My Applications</a></div>
	}

	renderAboutItem(){
		const introName = polyglot.t('aboutPlatform');
		let classes = classNames("scopes-list-item", {
			"active": !this.props.selectedScope
		});
		return <div className={classes} onClick={this.selectScope.bind(this, null)}>{this.props.intro.name ? this.props.intro.name : introName}</div>
	}
}

export default ViewsOverlay;

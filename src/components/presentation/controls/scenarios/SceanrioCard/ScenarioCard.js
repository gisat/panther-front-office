import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import './ScenarioCard.css';

class ScenarioCard extends React.PureComponent {

	static propTypes = {
		checked: PropTypes.bool,
		description: PropTypes.string,
		disableEditing: PropTypes.bool,
		name: PropTypes.string,
		scenarioKey: PropTypes.number,
	};

	constructor(props){
		super(props);

		this.state = {
			checked: this.props.checked,
			showDetails: !this.props.scenarioKey || false
		};
		this.handleDetailsButtonClick = this.handleDetailsButtonClick.bind(this);
		this.handleScenarioClick = this.handleScenarioClick.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			checked: nextProps.checked,
			showDetails:!this.props.scenarioKey || false
		});
	}

	handleDetailsButtonClick(){
		this.setState({
			showDetails: !this.state.showDetails
		});
	};

	handleScenarioClick(e){
		this.props.handleScenarioClick(this.props.scenarioKey, e.target.checked);
	};

	render() {
		let classes = classNames("scenario-card", {
			'not-created': !this.props.scenarioKey
		});

		let header = this.renderHeader();
		let body = null;

		if (this.state.showDetails){
			body = this.renderBody();
		}

		return (
			<div className={classes}>
				{header}
				{body}
			</div>
		);
	}

	renderHeader(){
		let checkbox = null;
		if (this.props.scenarioKey){
			checkbox = (<div className="scenario-card-header-checkbox">
				<input onChange={this.handleScenarioClick} type="checkbox" checked={this.state.checked}/>
			</div>);
		}

		return (
			<div className="scenario-card-header">
				{checkbox}
				<div className="scenario-card-header-title">
					<InputText
						large
						placeholder="Add scenario name"
						simpleDecoration
						disableEditing={this.props.disableEditing}
						value={this.props.name}/>
				</div>
				<div className="scenario-card-header-buttons">
					<button onClick={this.handleDetailsButtonClick}>Details</button>
				</div>
			</div>
		);
	}

	renderBody(){
		return (
			<div className="scenario-card-body">
				<InputText
					multiline
					placeholder="Add scenario description"
					simpleDecoration
					disableEditing={this.props.disableEditing}
					value={this.props.description}
				/>
				<div className="scenario-card-body-buttons">
					<button disabled={true}>
						Upload
					</button>
					<button disabled={true}>
						Download
					</button>
					<button disabled={true}>
						Save
					</button>
				</div>
			</div>
		);
	}
}

export default ScenarioCard;

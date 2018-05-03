import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import InputText from '../../../atoms/InputText/InputText';
import Button from '../../../atoms/Button';
import './ScenarioCard.css';

class ScenarioCard extends React.PureComponent {

	static propTypes = {
		checked: PropTypes.bool,
		defaultSituation: PropTypes.bool,
		description: PropTypes.string,
		disableEditing: PropTypes.bool,
		disableUncheck: PropTypes.bool,
		name: PropTypes.string,
		scenarioKey: PropTypes.number,
	};

	constructor(props){
		super(props);

		this.state = {
			checked: props.checked,
			editing: !props.scenarioKey && !props.defaultSituation,
			showDetails: !props.scenarioKey || false
		};

		this.handleDetailsButtonClick = this.handleDetailsButtonClick.bind(this);
		this.handleScenarioClick = this.handleScenarioClick.bind(this);
		this.toggleEditing = this.toggleEditing.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			checked: nextProps.checked,
			showDetails:!this.props.scenarioKey || false
		});
	}


	toggleEditing() {
		this.setState({editing: !this.state.editing});
	}

	handleDetailsButtonClick(){
		this.setState({
			showDetails: !this.state.showDetails
		});
	};

	handleScenarioClick(e){
		this.props.handleScenarioClick(this.props.scenarioKey, e.target.checked, this.props.defaultSituation);
	};


	render() {
		let classes = classNames("scenario-card", {
			'not-created': !this.props.scenarioKey && !this.props.defaultSituation
		});

		let header = (
			<div className="scenario-card-header">
				<div className="scenario-card-header-checkbox">
					<input
						type="checkbox"
						checked={this.state.checked}
						disabled={(this.props.disableUncheck && this.state.checked) || (!this.props.scenarioKey && !this.props.defaultSituation)}
						onChange={this.handleScenarioClick}
					/>
				</div>
				<div className="scenario-card-header-title">
					<InputText
						large
						placeholder="Add scenario name"
						simpleDecoration
						disableEditing={!this.props.editing || this.props.disableEditing}
						value={this.props.name}
					/>
				</div>
				<div className="scenario-card-header-buttons">
					{!this.props.defaultSituation ? (
						<Button
							invisible
							icon="edit"
							onClick={this.toggleEditing}
						/>
					) : null}
				</div>
			</div>
		);

		let body = !this.props.defaultSituation ? (
			<div className="scenario-card-body">
				<InputText
					multiline
					placeholder="Add scenario description"
					simpleDecoration
					disableEditing={!this.props.editing || this.props.disableEditing}
					value={this.props.description}
				/>
				{this.state.editing ? (
					<div className="scenario-card-body-buttons">
						<Button disabled={true}>
							Save
						</Button>
					</div>
				) : null}
			</div>
		) : null;

		return (
			<div className={classes}>
				{header}
				{body}
			</div>
		);
	}
}

export default ScenarioCard;

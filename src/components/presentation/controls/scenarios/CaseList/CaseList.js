import React from 'react';
import PropTypes from 'prop-types';
import {utils} from "panther-utils"
import _ from 'lodash';
import classNames from 'classnames';

import './CaseList.css'

import Button from '../../../../common/atoms/Button';
import Names from '../../../../../constants/Names';

let polyglot = window.polyglot;

class CaseList extends React.PureComponent {

	static propTypes = {
		activeCaseKey: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		changeActiveScreen: PropTypes.func,
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func,

		enableCreate: PropTypes.bool
	};

	componentWillReceiveProps(nextProps){
		if ((!nextProps.cases || !nextProps.cases.length) && this.props.activeCaseKey){
			this.props.setActiveCase(null);
		}
	}

	showDetail(caseKey){
		if (!caseKey) {
			caseKey = utils.uuid();
			this.props.setDefaultSituationActive();
		}
		this.props.setActiveCase(caseKey);
		this.props.changeActiveScreen('caseDetail');
		this.props.changeDefaultMapName(Names.SCENARIOS_DEFAULT_SITUATION_NAME);
	}

	render() {
		let cases = [...this.props.cases, ..._.reject(this.props.casesEdited, model => {
			return _.find(this.props.cases, {key: model.key});
		})]; //todo move to selector?

		let self = this;
		let casesInsert = cases.map((caseData) => {
			let edited = _.find(this.props.casesEdited, (caseEdited)=>{
				return caseData.key === caseEdited.key;
			});
			let editedScenario = false;
			let scenariosCount = 0;
			let scenariosText = polyglot.t('scenario');

			if (caseData.data && caseData.data.scenarios){
				caseData.data.scenarios.map(caseScenario => {
					if (self.props.scenariosEdited){
						self.props.scenariosEdited.map(editedScenarioData => {
							if (caseScenario === editedScenarioData.key){
								editedScenario = true;
							}
						});
					}
				});
				scenariosCount = caseData.data.scenarios.length;
				if (scenariosCount > 1){
					scenariosText = polyglot.t('scenarios');
				}
			}

			let classes = classNames('case-list-item', {
				'unsaved-editing': edited || editedScenario
			});

			// always render Unsaved editing because of the same width of whole card
			return (
				<div key={caseData.key} className={classes} onClick={this.showDetail.bind(this, caseData.key)}>
					<h4>{caseData.data.name}</h4>
					<div className='case-list-item-footer'>
						<span className='case-list-item-footer-scenarios'>{scenariosCount} {scenariosText}</span>
						<span className='case-list-item-footer-editing'>{polyglot.t('unsavedEditing')}</span>
					</div>
				</div>);
		});


		let addCaseBtn = null;
		if (this.props.enableCreate){
			addCaseBtn = (
				<Button
					floatingAction
					icon="plus"
					onClick={this.showDetail.bind(this, null)}
					id="ptr-case-list-add-case-button"
				>{polyglot.t('createCase')}</Button>
			);
		}

		return (
			<div className='case-list-wrap'>
				<div className='case-list-container'>{casesInsert}</div>
				{addCaseBtn}
			</div>
		);
	}

}

export default CaseList;

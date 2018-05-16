import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import './CaseList.css'

import Button from '../../../atoms/Button';

class CaseList extends React.PureComponent {

	static propTypes = {
		changeActiveScreen: PropTypes.func,
		disableEditing: PropTypes.bool,
		defaultSituationName: PropTypes.string,
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func
	};

	showDetail(caseKey){
		if (!caseKey) {
			caseKey = utils.guid();
			this.props.setDefaultSituationActive();
		}
		this.props.setActiveCase(caseKey);
		this.props.changeActiveScreen('caseDetail');
		this.props.changeDefaultMapName(this.props.defaultSituationName);
	}

	render() {
		let cases = this.props.cases.map((caseData) => {
			let scenariosCount = 0;
			if (caseData.scenarios){
				scenariosCount = caseData.scenarios.length;
			}

			return (
				<div key={caseData.key} className='case-list-item' onClick={this.showDetail.bind(this, caseData.key)}>
					<h4>{caseData.name}</h4>
					<span>Scenarios: {scenariosCount}</span>
				</div>);
		});

		let addCaseBtn = null;
		if (!this.props.disableEditing){
			addCaseBtn = (
				<Button
					floatingAction
					circular
					icon="plus"
					onClick={this.showDetail.bind(this, null)}
					id="ptr-case-list-add-case-button"
				/>
			);
		}


		return (
			<div className='case-list-wrap'>
				<div className='case-list-container'>{cases}</div>
				{addCaseBtn}
			</div>
		);
	}

}

export default CaseList;

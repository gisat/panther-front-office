import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import './CaseList.css'

class CaseList extends React.PureComponent {

	static propTypes = {
		disableEditing: PropTypes.bool,
		screenId: PropTypes.string,
		setCaseDetailType: PropTypes.func,
		switchScreen: PropTypes.func
	};

	showDetail(caseKey){
		this.props.setActiveCase(caseKey);
		this.props.switchScreen('caseDetail');
	}

	render() {
		let cases = this.props.cases.map((caseData) => {
			return (
				<div key={caseData.key} className='case-list-item' onClick={this.showDetail.bind(this, caseData.key)}>
					<h4>{caseData.name}</h4>
					<span>Scenarios: {caseData.scenarios.length}</span>
				</div>);
		});

		let addCaseBtn = null;
		if (!this.props.disableEditing){
			addCaseBtn = (<div className='add-case-button' onClick={this.showDetail.bind(this, null)}>
				<span>+</span>
			</div>);
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

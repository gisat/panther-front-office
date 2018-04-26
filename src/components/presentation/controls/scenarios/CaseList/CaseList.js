import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

import './CaseList.css'

class CaseList extends React.PureComponent {

	static propTypes = {
		screenId: PropTypes.string,
		setCaseDetailType: PropTypes.func,
		switchScreen: PropTypes.func
	};

	showDetail(type){
		this.props.setCaseDetailType(type);
		this.props.switchScreen('caseDetail');
	}

	render() {
		let cases = this.props.cases.map((caseData) => {
			return (
				<div className='case-list-item' onClick={this.showDetail.bind(this, 'existing')}>
					<h4>{caseData.name}</h4>
					<span>Scenarios: {caseData.scenarios.length}</span>
				</div>);
		});

		// todo render button only for admin group
		return (
			<div>
				<div className='case-list-container'>{cases}</div>
				<div className='add-case-button' onClick={this.showDetail.bind(this, 'new')}>
					<span>+</span>
				</div>
			</div>
		);
	}

}

export default CaseList;

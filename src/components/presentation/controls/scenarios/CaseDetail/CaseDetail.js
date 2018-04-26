import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

class CaseDetail extends React.PureComponent {

	static propTypes = {
		activeScenarioKeys: PropTypes.array,
		case: PropTypes.object,
		contentType: PropTypes.string,
		screenId: PropTypes.string,
		switchScreen: PropTypes.func
	};

	render() {
		let caseData = this.props.case;
		let name = "new";
		if (caseData){
			name = caseData.name;
		}

		return (
			<div onClick={this.props.switchScreen.bind(null, 'caseList')}>{name}</div>
		);
	}

}

export default CaseDetail;

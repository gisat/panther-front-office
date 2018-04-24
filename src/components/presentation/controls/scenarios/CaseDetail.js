import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';

class CaseDetail extends React.PureComponent {

	render() {
		return (
			<div onClick={this.props.switchScreen.bind(null, 'caseList')}>Detail</div>
		);
	}

}

export default CaseDetail;

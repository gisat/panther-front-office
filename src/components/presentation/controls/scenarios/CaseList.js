import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';

class CaseList extends React.PureComponent {

	render() {
		return (
			<div onClick={this.props.switchScreen.bind(null, 'caseDetail')}>List</div>
		);
	}

}

export default CaseList;

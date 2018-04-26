import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../../utils/utils';
import _ from 'lodash';

class CaseDetail extends React.PureComponent {

	static propTypes = {
		screenId: PropTypes.string,
		contentType: PropTypes.string,
		switchScreen: PropTypes.func
	};

	render() {
		return (
			<div onClick={this.props.switchScreen.bind(null, 'caseList')}>{this.props.contentType}</div>
		);
	}

}

export default CaseDetail;

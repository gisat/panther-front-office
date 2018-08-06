import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

import Case from './Case';
import Review from './Review';
import UserActions from './UserActions';
import MapTools from './MapTools';

class DromasLpisChangeReviewHeader extends React.PureComponent {

	static propTypes = {
		case: PropTypes.object
	};

	render() {
		return (
			<div id="dromasLpisChangeReviewHeader">
				<div id="dromasLpisChangeReviewHeader-case"><Case case={this.props.case}/></div>
				<div id="dromasLpisChangeReviewHeader-review"><Review  case={this.props.case}/></div>
				<div id="dromasLpisChangeReviewHeader-actions"><UserActions /></div>
				<div id="dromasLpisChangeReviewHeader-tools"><MapTools /></div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;

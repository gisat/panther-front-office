import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

import DromasLpisChangeReviewHeaderCase from './DromasLpisChangeReviewHeaderCase';
import DromasLpisChangeReviewHeaderReview from './DromasLpisChangeReviewHeaderReview';
import DromasLpisChangeReviewHeaderUserActions from './DromasLpisChangeReviewHeaderUserActions';
import DromasLpisChangeReviewHeaderMapTools from './DromasLpisChangeReviewHeaderMapTools';

class DromasLpisChangeReviewHeader extends React.PureComponent {
	render() {
		return (
			<div id="dromasLpisChangeReviewHeader">
				<div id="dromasLpisChangeReviewHeader-case"><DromasLpisChangeReviewHeaderCase /></div>
				<div id="dromasLpisChangeReviewHeader-review"><DromasLpisChangeReviewHeaderReview /></div>
				<div id="dromasLpisChangeReviewHeader-actions"><DromasLpisChangeReviewHeaderUserActions /></div>
				<div id="dromasLpisChangeReviewHeader-tools"><DromasLpisChangeReviewHeaderMapTools /></div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;

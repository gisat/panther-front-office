import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Case from './Case';
import Review from './Review';
import UserActions from './UserActions';
import Button from "../../../../components/common/atoms/Button";

class DromasLpisChangeReviewHeader extends React.PureComponent {

	static propTypes = {
		case: PropTypes.object,
		userApprovedEvaluation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		userGroups: PropTypes.array,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object,
		saveEvaluation: PropTypes.func,
		saveAndApproveEvaluation: PropTypes.func,
		approveEvaluation: PropTypes.func,
		rejectEvaluation: PropTypes.func,
		closeEvaluation: PropTypes.func,
		goToNextCase: PropTypes.func,
		nextCaseKey: PropTypes.string
	};
	render() {
		return (
			<div id="dromasLpisChangeReviewHeader">
				<div id="dromasLpisChangeReviewHeader-back">
					<div>
						<Button invisible inverted circular icon="back" onClick={this.props.switchScreen}/>
					</div>
				</div>
				<div id="dromasLpisChangeReviewHeader-case">
					<Case
						case={this.props.case}
						userCreatedCase={this.props.userCreatedCase}
					/>
				</div>
				<div id="dromasLpisChangeReviewHeader-review">
					<Review
						case={this.props.case}
						userApprovedEvaluation={this.props.userApprovedEvaluation}
						userGroups={this.props.userGroups}
						editActiveCase={this.props.editActiveCase}
						caseEdited={this.props.activeCaseEdited}
					/>
				</div>
				<div id="dromasLpisChangeReviewHeader-actions">
					<UserActions
						case={this.props.case}
						userGroups={this.props.userGroups}
						saveEvaluation={this.props.saveEvaluation}
						saveAndApproveEvaluation={this.props.saveAndApproveEvaluation}
						approveEvaluation={this.props.approveEvaluation}
						rejectEvaluation={this.props.rejectEvaluation}
						closeEvaluation={this.props.closeEvaluation}
						nextCaseKey={this.props.nextCaseKey}
						goToNextCase={this.props.goToNextCase}
					/>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;

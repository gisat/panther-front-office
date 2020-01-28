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
		userApprovedEvaluation: PropTypes.object,
		userCreatedCase: PropTypes.object,
		userGroup: PropTypes.string,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object,
		saveEvaluation: PropTypes.func,
		saveAndApproveEvaluation: PropTypes.func,
		approveEvaluation: PropTypes.func,
		rejectEvaluation: PropTypes.func,
		closeEvaluation: PropTypes.func,
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
						userGroup={this.props.userGroup}
						editActiveCase={this.props.editActiveCase}
						caseEdited={this.props.activeCaseEdited}
					/>
				</div>
				<div id="dromasLpisChangeReviewHeader-actions">
					<UserActions
						case={this.props.case}
						userGroup={this.props.userGroup}
						saveEvaluation={this.props.saveEvaluation}
						saveAndApproveEvaluation={this.props.saveAndApproveEvaluation}
						approveEvaluation={this.props.approveEvaluation}
						rejectEvaluation={this.props.rejectEvaluation}
						closeEvaluation={this.props.closeEvaluation}
						nextCaseKey={this.props.nextCaseKey}
					/>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;

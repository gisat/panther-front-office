import React from 'react';
import PropTypes from 'prop-types';
import ExpandableContent from "./ExpandableContent";
import EditableText from "../../../presentation/atoms/EditableText";

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userGroup: PropTypes.string
	};

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar">
					{this.renderStatus(this.props.case)}
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						{this.renderEvaluation(this.props.case)}
					</ExpandableContent>
				</div>
			</div>
		);
	}

	renderStatus(changeReviewCase) {
		if(changeReviewCase) {
			return (
				<div>
					{changeReviewCase.status}
				</div>
			)
		}
	}

	renderEvaluation(changeReviewCase) {
		if(changeReviewCase) {
			return (
				<div>
					<EditableText
						value={changeReviewCase.data.evaluation_description}
						disabled={!(this.props.userGroup && this.props.userGroup.toLowerCase().includes('gisat'))}
					/>
				</div>
			)
		}
	}

}

export default DromasLpisChangeReviewHeader;

import React from 'react';
import PropTypes from 'prop-types';
import ExpandableContent from "./ExpandableContent";

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object
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
					{changeReviewCase.data.evaluation_description}
				</div>
			)
		}
	}

}

export default DromasLpisChangeReviewHeader;

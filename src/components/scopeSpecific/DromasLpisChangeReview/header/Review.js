import React from 'react';
import PropTypes from 'prop-types';
import ExpandableContent from "./ExpandableContent";
import ReviewForm from './ReviewForm';

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userGroup: PropTypes.string,
		editActiveCase: PropTypes.func,
		activeCaseEdited: PropTypes.object
	};

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar">
					{this.renderStatus(this.props.case)}
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						<ReviewForm
							case={this.props.activeCaseEdited || this.props.case}
							editActiveCase={this.props.editActiveCase}
							userGroup={this.props.userGroup}
						/>
					</ExpandableContent>
				</div>
			</div>
		);
	}

	renderStatus(changeReviewCase) {
		if(changeReviewCase) {
			return (
				<div>
					závěr
				</div>
			)
		}
	}

}

export default DromasLpisChangeReviewHeader;

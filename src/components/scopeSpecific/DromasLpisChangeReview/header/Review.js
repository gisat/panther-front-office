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
					<span className='ptr-dromasLpisChangeReviewHeader-heading'>Vyhodnocení</span>
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						<ReviewForm
							case={this.props.case}
							caseEdited={this.props.activeCaseEdited}
							editActiveCase={this.props.editActiveCase}
							userGroup={this.props.userGroup}
						/>
					</ExpandableContent>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;

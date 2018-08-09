import React from 'react';
import PropTypes from 'prop-types';
import ExpandableContent from "./ExpandableContent";
import ReviewForm from './ReviewForm';
import UISelect from "../../../presentation/atoms/UISelect/UISelect";
import {evaluationConclusions} from "../../../../constants/LpisCaseStatuses";

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
				<div className="ptr-dromasLpisChangeReviewHeader-topBar review">
					<div>
						<span className='ptr-dromasLpisChangeReviewHeader-heading'>Vyhodnocení</span>
					</div>
					<div>
						<UISelect
							inverted
							options={evaluationConclusions}
							value={this.props.case && this.props.case.data.evaluation_result}
							placeholder="závěr"
						/>
					</div>
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

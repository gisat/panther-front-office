import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import User from "../../../../components/common/atoms/User";

import ExpandableContent from './ExpandableContent';

class DromasLpisCase extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userCreatedCase: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	};
	
	render() {
		const CaseDetail = this.renderCase(this.props.case);
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar case">
					<span className='ptr-dromasLpisChangeReviewHeader-heading'>Ohlášení územní změny</span>
					<span className='ptr-dromasLpisChangeReviewHeader-caseKey'>{this.props.case && this.props.case.data.caseKey || ''}</span>
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						<CaseDetail />
					</ExpandableContent>
				</div>
			</div>
		);
	}

	renderCase(changeReviewCase) {
		if(changeReviewCase) {

			let placeInsert, otherInsert, dpbInsert, jiInsert, userInsert;

			if (changeReviewCase.data.changeDescriptionPlace) {
				placeInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Určení místa změny v terénu</div>
						{utils.renderParagraphWithSeparatedLines(changeReviewCase.data.changeDescriptionPlace)}
					</div>
				);
			}

			if (changeReviewCase.data.changeDescriptionOther) {
				otherInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Další informace</div>
						{utils.renderParagraphWithSeparatedLines(changeReviewCase.data.changeDescriptionOther)}
					</div>
				);
			}

			if (changeReviewCase.data.codeDpb) {
				dpbInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Kód DPB</div>
						<p>{changeReviewCase.data.codeDpb}</p>
					</div>
				);
			}

			if (changeReviewCase.data.codeJi) {
				jiInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Kód JI</div>
						<p>{changeReviewCase.data.codeJi}</p>
					</div>
				);
			}

			if (this.props.userCreatedCase === 0 || this.props.userCreatedCase){
				userInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Řízení zadal</div>
						<User userKey={this.props.userCreatedCase}/>
					</div>
				);
			}

			return (
				(props) => {
					return (
						<div onFocus={props.onFocusInput} onBlur={props.onBlurInput}>
							{utils.renderParagraphWithSeparatedLines(changeReviewCase.data.changeDescription)}
							{placeInsert}
							{otherInsert}
							{dpbInsert}
							{jiInsert}
							{userInsert}
						</div>
					)
				}
			)
		}
	}
}

export default DromasLpisCase;

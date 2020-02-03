import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';

import ExpandableContent from './ExpandableContent';

class DromasLpisCase extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userCreatedCase: PropTypes.object
	};

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar case">
					<span className='ptr-dromasLpisChangeReviewHeader-heading'>Ohlášení územní změny</span>
					<span className='ptr-dromasLpisChangeReviewHeader-caseKey'>{this.props.case && this.props.case.data.caseKey || ''}</span>
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						{this.renderCase(this.props.case)}
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

			if (this.props.userCreatedCase){
				let user = this.props.userCreatedCase;
				userInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Řízení zadal</div>
						<p>{user.name} ({user.email})</p>
					</div>
				);
			}

			return (
				(props) => {
					return (<div onFocus={props.onFocusInput} onBlur={props.onBlurInput}>
						{utils.renderParagraphWithSeparatedLines(changeReviewCase.data.change_description)}
						{placeInsert}
						{otherInsert}
						{dpbInsert}
						{jiInsert}
						{userInsert}
					</div>)
				}
			)
		}
	}
}

export default DromasLpisCase;

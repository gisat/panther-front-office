import React from 'react';
import PropTypes from 'prop-types';

import ExpandableContent from './ExpandableContent';

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object
	};

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar case">
					<span className='ptr-dromasLpisChangeReviewHeader-heading'>Ohlášení územní změny</span>
					<span className='ptr-dromasLpisChangeReviewHeader-caseKey'>{this.props.case && this.props.case.data.case_key || ''}</span>
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

			let placeInsert, otherInsert, dpbInsert, jiInsert;

			if (changeReviewCase.data.change_description_place) {
				placeInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Určení místa změny v terénu</div>
						<p>{changeReviewCase.data.change_description_place}</p>
					</div>
				);
			}

			if (changeReviewCase.data.change_description_other) {
				otherInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Další informace</div>
						<p>{changeReviewCase.data.change_description_other}</p>
					</div>
				);
			}

			if (changeReviewCase.data.code_dpb) {
				dpbInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Kód DPB</div>
						<p>{changeReviewCase.data.code_dpb}</p>
					</div>
				);
			}

			if (changeReviewCase.data.code_ji) {
				jiInsert = (
					<div>
						<div className='ptr-dromasLpisChangeReviewHeader-property'>Kód JI</div>
						<p>{changeReviewCase.data.code_ji}</p>
					</div>
				);
			}
			return (
				<div>
					<p>{changeReviewCase.data.change_description}</p>
					{placeInsert}
					{otherInsert}
					{dpbInsert}
					{jiInsert}
				</div>
			)
		}
	}
}

export default DromasLpisChangeReviewHeader;

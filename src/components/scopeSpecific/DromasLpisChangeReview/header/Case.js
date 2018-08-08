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
				<div className="ptr-dromasLpisChangeReviewHeader-topBar">
					<span className='ptr-dromasLpisChangeReviewHeader-heading'>Ohlášení územní změny</span>
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

			let placeInsert, otherInsert;

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
			return (
				<div>
					<p>{changeReviewCase.data.change_description}</p>
					{placeInsert}
					{otherInsert}
				</div>
			)
		}
	}
}

export default DromasLpisChangeReviewHeader;

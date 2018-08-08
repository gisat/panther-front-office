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
			return (
				<div>
					{changeReviewCase.data.change_description}
				</div>
			)
		}
	}
}

export default DromasLpisChangeReviewHeader;

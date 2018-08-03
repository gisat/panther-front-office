import React from 'react';
import PropTypes from 'prop-types';

import ExpandableContent from './ExpandableContent';

class DromasLpisChangeReviewHeader extends React.PureComponent {
	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar">
					Ohlášení územní změny
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					<ExpandableContent>
						<div>
							HOHOHO
						</div>
					</ExpandableContent>
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;

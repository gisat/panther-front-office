import React from 'react';
import PropTypes from 'prop-types';

import User from '../../../common/controls/User';

class DromasLpisChangeReviewHeader extends React.PureComponent {
	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar">
					<User />
				</div>
				<div>
					actions
				</div>
			</div>
		);
	}

}

export default DromasLpisChangeReviewHeader;

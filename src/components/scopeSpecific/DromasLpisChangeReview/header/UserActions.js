import React from 'react';
import PropTypes from 'prop-types';

import LpisCaseStatuses from "../../../../constants/LpisCaseStatuses";

import User from '../../../common/controls/User';

class DromasLpisChangeReviewHeader extends React.PureComponent {
	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar userActions">
					<div>
						<span className='ptr-dromasLpisChangeReviewHeader-heading'>Řízení</span>
						{this.renderStatus(this.props.case)}
					</div>
					<User />
				</div>
				<div>
					<div>
						actions
					</div>
				</div>
			</div>
		);
	}

	renderStatus(changeReviewCase) {
		if (changeReviewCase) {
			let status = LpisCaseStatuses[changeReviewCase.status];
			let caption, colour;
			if (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins') {
				caption = status.gisatName;
				colour = status.gisatColour || status.colour;
			} else {
				caption = status.szifName;
				colour = status.colour;
			}
			let style = {
				'background': colour
			};
			return (
				<span className='ptr-dromasLpisChangeReviewHeader-status' style={style}>{caption}</span>
			);
		}
	}

}

export default DromasLpisChangeReviewHeader;

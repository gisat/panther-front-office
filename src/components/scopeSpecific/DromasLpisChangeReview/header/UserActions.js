import React from 'react';
import PropTypes from 'prop-types';

import LpisCaseStatuses from "../../../../constants/LpisCaseStatuses";

import User from '../../../common/controls/User';
import Button from "../../../presentation/atoms/Button";

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userGroup: PropTypes.string,
		saveCaseAsCreated: PropTypes.func,
		saveCaseAsApproved: PropTypes.func,
		saveCaseAsClosed: PropTypes.func,
		saveCaseAsEvaluated: PropTypes.func
	};

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
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					{this.renderButtons(this.props.case)}
				</div>
			</div>
		);
	}

	renderButtons(changeReviewCase) {
		if(this.props.userGroup && changeReviewCase) {
			switch (this.props.userGroup) {
				case `gisatAdmins`:
					return this.renderButtonsForGisatAdmins(changeReviewCase);
				case `gisatUsers`:
					return this.renderButtonsForGisatUsers(changeReviewCase);
				case `szifAdmins`:
				case `szifUsers`:
					return this.renderButtonsForSzifs(changeReviewCase);
			}
		} else {
			return null;
		}
	}

	renderButtonsForGisatAdmins(changeReviewCase) {
		if(changeReviewCase.status === LpisCaseStatuses.CREATED.database) {
			return (
				<div key="gisatAdmins-created">
					<div><Button inverted onClick={this.props.saveCaseAsEvaluated}>Uložit vyhodnocení</Button></div>
					{/*<div><Button inverted onClick={this.props.saveCaseAsApproved}>Uložit & schválit vyhodnocení</Button></div>*/}
				</div>
			)
		} else if(changeReviewCase.status === LpisCaseStatuses.EVALUATION_CREATED.database) {
			return (
				<div key="gisatAdmins-evaluationCreated">
					<div><Button primary onClick={this.props.saveCaseAsApproved}>Schválit vyhodnocení</Button></div>
					<div><Button inverted onClick={this.props.saveCaseAsCreated}>Vrátit k vyhodnocení</Button></div>
				</div>
			)
		} else if(changeReviewCase.status === LpisCaseStatuses.EVALUATION_APPROVED.database) {
			return (
				<div key="gisatAdmins-evaluationApproved">
					<div><Button inverted onClick={this.props.saveCaseAsCreated}>Vrátit k vyhodnocení</Button></div>
				</div>
			)
		}
	}

	renderButtonsForGisatUsers(changeReviewCase) {
		if(changeReviewCase.status === LpisCaseStatuses.CREATED.database) {
			return (
				<div key="gisatUsers-created">
					<div><Button primary onClick={this.props.saveCaseAsEvaluated}>Uložit vyhodnocení</Button></div>
				</div>
			)
		}
	}

	renderButtonsForSzifs(changeReviewCase) {
		if(changeReviewCase.status === LpisCaseStatuses.EVALUATION_APPROVED.database) {
			return (
				<div key="szif-evaluationApproved">
					<div><Button primary onClick={this.props.saveCaseAsClosed}>Uzavřít</Button></div>
					<div><Button inverted onClick={this.props.saveCaseAsCreated}>Vrátit k vyhodnocení</Button></div>
				</div>
			)
		}
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

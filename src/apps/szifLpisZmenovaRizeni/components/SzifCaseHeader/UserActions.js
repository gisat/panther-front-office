import React from 'react';
import PropTypes from 'prop-types';

import LpisCaseStatuses from "../../constants/LpisCaseStatuses";

import User from "../Login/";
import Button from "../../../../components/common/atoms/Button";

class DromasLpisChangeReviewHeader extends React.PureComponent {
	static propTypes = {
		case: PropTypes.object,
		userGroups: PropTypes.array,
		saveEvaluation: PropTypes.func,
		saveAndApproveEvaluation: PropTypes.func,
		approveEvaluation: PropTypes.func,
		rejectEvaluation: PropTypes.func,
		closeEvaluation: PropTypes.func,
		goToNextCase: PropTypes.func,
		resetView: PropTypes.func,
		readyToSaveEvaluation: PropTypes.bool,
	};

	render() {
		return (
			<div>
				<div className="ptr-dromasLpisChangeReviewHeader-topBar userActions">
					<div>
						{/*<span className='ptr-dromasLpisChangeReviewHeader-heading'>Řízení</span>*/}
						{this.renderStatus(this.props.case)}
					</div>
					<User />
				</div>
				<div className="ptr-dromasLpisChangeReviewHeader-content">
					{this.renderButtons(this.props.case)}
					{this.renderButtonNext()}
				</div>
				{this.renderButtonResetView()}
			</div>
		);
	}

	renderButtons(changeReviewCase) {
		if(this.props.userGroups && changeReviewCase) {
			if(this.props.userGroups.includes('gisatAdmins')) {
				return this.renderButtonsForGisatAdmins(changeReviewCase);
			} else if(this.props.userGroups.includes('gisatUsers')) {
				return this.renderButtonsForGisatUsers(changeReviewCase);
			} else if(this.props.userGroups.includes('szifAdmins') || this.props.userGroups.includes('szifUsers') || this.props.userGroups.includes('szifRegionAdmins')) {
				return this.renderButtonsForSzifs(changeReviewCase);
			}
		} else {
			return null;
		}
	}

	renderButtonNext() {
		if (this.props.nextCaseKey) {
			return (
				<Button inverted onClick={() => this.props.goToNextCase(this.props.nextCaseKey)}>
					Přejít na další řízení
				</Button>
			)
		} else {
			return null;
		}
	}

	renderButtonResetView() {
		return (
			<Button inverted onClick={this.props.resetView}>
				Restartovat mapu
			</Button>
		)
	}

	renderButtonNextCaseIndicator() {
		if (this.props.nextCaseKey) {
			return (
				<div className="ptr-dromasLpisChangeReviewHeader-button-nextCase">& pokračovat na další řízení</div>
			);
		}
	}

	renderButtonsForGisatAdmins(changeReviewCase) {
		if(changeReviewCase.data.status.toUpperCase() === LpisCaseStatuses.CREATED.database) {
			return (
				<div key="gisatAdmins-created">
					<div>
						<Button inverted onClick={() => this.props.saveEvaluation(this.props.case.key, this.props.nextCaseKey)} disabled={!this.props.readyToSaveEvaluation}>
							Uložit vyhodnocení
							{this.renderButtonNextCaseIndicator()}
						</Button>
					</div>
					<div>
						<Button inverted onClick={() => this.props.saveAndApproveEvaluation(this.props.nextCaseKey)} disabled={!this.props.readyToSaveEvaluation}>
							Uložit a schválit vyhodnocení
							{this.renderButtonNextCaseIndicator()}
						</Button>
					</div>
				</div>
			)
		} else if(changeReviewCase.data.status.toUpperCase() === LpisCaseStatuses.EVALUATION_CREATED.database) {
			return (
				<div key="gisatAdmins-evaluationCreated">
					<div>
						<Button primary onClick={() => this.props.approveEvaluation(this.props.nextCaseKey)}>
							Schválit vyhodnocení
							{this.renderButtonNextCaseIndicator()}
						</Button>
					</div>
					<div>
						<Button inverted onClick={() => this.props.rejectEvaluation(this.props.nextCaseKey)}>
							Vrátit k vyhodnocení
							{this.renderButtonNextCaseIndicator()}
						</Button>
					</div>
				</div>
			)
		} else if(changeReviewCase.data.status.toUpperCase() === LpisCaseStatuses.EVALUATION_APPROVED.database) {
			return (
				<div key="gisatAdmins-evaluationApproved">
					<div>
						<Button inverted onClick={() => this.props.rejectEvaluation(this.props.nextCaseKey)}>
							Vrátit k vyhodnocení
							{this.renderButtonNextCaseIndicator()}
						</Button>
					</div>
				</div>
			)
		}
	}

	renderButtonsForGisatUsers(changeReviewCase) {
		if(changeReviewCase.data.status.toUpperCase() === LpisCaseStatuses.CREATED.database) {
			return (
				<div key="gisatUsers-created">
					<div>
						<Button primary onClick={() => this.props.saveEvaluation(this.props.case.key, this.props.nextCaseKey)} disabled={!this.props.readyToSaveEvaluation}>
							Uložit vyhodnocení
							{this.renderButtonNextCaseIndicator()}
						</Button>
					</div>
				</div>
			)
		}
	}

	renderButtonsForSzifs(changeReviewCase) {
		if(changeReviewCase.data.status.toUpperCase() === LpisCaseStatuses.EVALUATION_APPROVED.database) {
			return (
				<div key="szif-evaluationApproved">
					<div>
						<Button primary onClick={this.props.closeEvaluation}>
							Uzavřít
							{this.renderButtonNextCaseIndicator()}
						</Button>
					</div>
				</div>
			)
		}
	}

	renderStatus(changeReviewCase) {
		if (changeReviewCase) {			
			let status = LpisCaseStatuses[changeReviewCase.data.status.toUpperCase()];
			let caption, colour;
			if (this.props.userGroups.includes('gisatUsers') || this.props.userGroups.includes('gisatAdmins')) {
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

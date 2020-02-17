import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {utils} from "panther-utils"

import Button from '../../../../common/atoms/Button';
import ExpandRowButton from '../../../../common/atoms/ExpandRowButton';
import Icon from '../../../../common/atoms/Icon';
import Menu, {MenuItem} from "../../../../common/atoms/Menu";

import LpisCaseStatuses, {evaluationConclusions as LpisEvaluation} from '../../../../../constants/LpisCaseStatuses';
import ChangeReviewsTableRowDetail from "../ChangeReviewsTableRowDetail";

class ChangeReviewsTableRow extends React.PureComponent {

	static propTypes = {
		caseKey: PropTypes.number,
		changes: PropTypes.array,
		createdBy: PropTypes.number,
		data: PropTypes.object,
		highlightedCaseKey: PropTypes.string,
		highlightedChangeDescription: PropTypes.string,
		status: PropTypes.string,
		updated: PropTypes.string,
		showCase: PropTypes.func,
		invalidateCase: PropTypes.func,
		userGroup: PropTypes.string,
		users: PropTypes.array,
		updatedBy: PropTypes.number,
		loadUsers: PropTypes.func
	};

	constructor(props){
		super(props);

		this.state = {
			detailsOpen: false
		};

		this.onDetailsClick = this.onDetailsClick.bind(this);
		this.onShowClick = this.onShowClick.bind(this);
		this.onInvalidateClick = this.onInvalidateClick.bind(this);
	}

	onShowClick() {
		this.props.showCase(this.props.caseKey);
	}

	onInvalidateClick() {
		this.props.invalidateCase(this.props.caseKey);
	}

	onDetailsClick(){
		this.setState({
			detailsOpen: !this.state.detailsOpen
		});
	}

	render(){
		let classes = classNames("ptr-table-row", {
			active: this.state.detailsOpen
		});

		let submitDate = moment(this.props.data.submit_date).format("D. M. YYYY");
		let updated = moment(this.props.updated).format("D. M. YYYY");
		let showMapButton = this.renderShowMapButton();

		return (
			<div className={classes}>
				<div className="ptr-table-row-record">
					{this.renderStatus()}
					{this.renderCaseKey()}
					<div className="ptr-table-row-item">{submitDate}</div>
					<div className="ptr-table-row-item">{updated}</div>
					<div className="ptr-table-row-item buttons">
						<div className="ptr-table-row-action">
							{showMapButton}
						</div>
						<ExpandRowButton
							invisible
							expanded={this.state.detailsOpen}
							onClick={this.onDetailsClick}
						/>
					</div>
				</div>
				{this.state.detailsOpen ? this.renderDetails() : null}
			</div>
		);
	}

	renderStatus(){
		let status = LpisCaseStatuses[this.props.status];
		let caption = null;
		let colour = null;
		let opacity = status.database === 'CLOSED' ? 0 : null;
		if (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins') {
			caption = status.gisatName;
			colour = status.gisatColour || status.colour;
		} else {
			caption = status.szifName;
			colour = status.colour;
		}

		return (
			<div className="ptr-table-row-item state">
				<Icon icon="circle" color={colour} opacity={opacity}/>
				{caption}
			</div>
		);
	}

	renderCaseKey(){
		return this.props.highlightedCaseKey ? (
			<div dangerouslySetInnerHTML={{__html: this.props.highlightedCaseKey}} className="ptr-table-row-item highlighted"></div>
		) : (
			<div className="ptr-table-row-item">{this.props.data.case_key}</div>
		);
	}

	renderShowMapButton(){
		let status = LpisCaseStatuses[this.props.status];
		let group = this.props.userGroup;

		let renderButton = group && (
			(group === "gisatAdmins" || group === "gisatUsers") || (
				(group === "szifAdmins" || group === "szifUsers") &&
				status &&
				(status.database === "EVALUATION_APPROVED" || status.database === "CLOSED")
			)
		);

		return renderButton ? (
			<Button
				small
				onClick={this.onShowClick}
			>
				Zobrazit
			</Button>
		) : null;
	}

	renderDetails(){
		return (
			<ChangeReviewsTableRowDetail
				createdBy={this.props.createdBy}
				data={this.props.data}
				highlightedChangeDescription={this.props.highlightedChangeDescription}
				onInvalidateClick={this.onInvalidateClick}
				status={this.props.status}
				updatedBy={this.props.updatedBy}
				userGroup={this.props.userGroup}
			/>
		);
	}
}

export default ChangeReviewsTableRow;
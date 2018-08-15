import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import Button from '../../../atoms/Button';
import ExpandRowButton from '../../../atoms/ExpandRowButton';
import Icon from '../../../atoms/Icon';
import Menu, {MenuItem} from "../../../atoms/Menu";

import LpisCaseStatuses, {evaluationConclusions as LpisEvaluation} from '../../../../../constants/LpisCaseStatuses';

class ChangeReviewsTableRow extends React.PureComponent {

	static propTypes = {
		caseKey: PropTypes.number,
		changes: PropTypes.array,
		data: PropTypes.object,
		status: PropTypes.string,
		updated: PropTypes.string,
		showCase: PropTypes.func,
		invalidateCase: PropTypes.func,
		userGroup: PropTypes.string,
		users: PropTypes.array,
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
					<div className="ptr-table-row-item">{this.props.data.case_key}</div>
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
				{this.renderDetails()}
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
		let classes = classNames(
			"ptr-table-row-details ptr-change-reviews-table-details", {
				open: this.state.detailsOpen
			}
		);

		let group = this.props.userGroup;
		let data = this.props.data;

		return (
			data ? (<div className={classes}>
				<div className={"ptr-change-reviews-table-details-top-bar"}>
					<div>
						{data.code_dpb ? this.renderCodeDpb(data.code_dpb) : null}
						{data.code_ji ? this.renderCodeJi(data.code_ji) : null}
						{/*<div className={"ptr-change-reviews-table-details-record location"}>*/}
							{/*<h4>Lokalita</h4>*/}
							{/*<span>České Budějovice</span>*/}
						{/*</div>*/}
						{group && (group === "gisatAdmins" || group === "gisatUsers") ? (this.renderLastChange()
						):null}
					</div>
					<div>
						<div className="ptr-change-reviews-table-details-top-bar-menu">
							<Button invisible icon="dots">
								<Menu bottom left>
									<MenuItem onClick={this.onInvalidateClick}>Zneplatnit záznam řízení</MenuItem>
								</Menu>
							</Button>
						</div>
					</div>
				</div>
				<div className={"ptr-change-reviews-table-details-descriptions"}>
					<div>
						<h3>Ohlášení územní změny</h3>
						{data.change_description ? this.renderChangeDescription(data.change_description) : null}
						{data.change_description_place ? this.renderChangeDescriptionPlace(data.change_description_place) : null}
						{data.change_description_other ? this.renderChangeDescriptionOther(data.change_description_other) : null}
					</div>
					<div>
						<h3>Výsledek vyhodnocení družicových dat</h3>
						{data.evaluation_result ? this.renderEvaluationResult(data.evaluation_result) : null}
						{data.evaluation_description ? this.renderEvaluationDescription(data.evaluation_description) : null}
						{data.evaluation_used_sources ? this.renderEvaluationUsedSources(data.evaluation_used_sources) : null}
						{data.evaluation_description_other ? this.renderEvaluationDescriptionOther(data.evaluation_description_other) : null}
					</div>
				</div>
			</div>) : null
		);
	}

	renderCodeDpb(data){
		return (
			<div className="ptr-change-reviews-table-details-record code-dpb">
				<h4>Kód DPB</h4>
				<span>{data}</span>
			</div>
		);
	}

	renderCodeJi(data){
		return (
			<div className="ptr-change-reviews-table-details-record code-ji">
				<h4>Kód JI</h4>
				<span>{data}</span>
			</div>
		);
	}

	renderLastChange(){
		let user = _.find(this.props.users, (user) => user.key === this.props.updatedBy);
		let userName = user ? user.name : "";
		return (
			<div className={"ptr-change-reviews-table-details-record last-changed"}>
				<h4>Poslední změna</h4>
				<span>{userName}</span>
			</div>
		);
	}

	renderChangeDescription(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Popis důvodu pro aktualizaci LPIS</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderChangeDescriptionPlace(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Určení místa změny v terénu</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderChangeDescriptionOther(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Další informace</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderEvaluationResult(data){
		let evalResult = _.find(LpisEvaluation, (result) => {return result.value === data});

		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Závěr vyhodnocení</h4>
				<p>{evalResult ? evalResult.label : ""}</p>
			</div>
		);
	}

	renderEvaluationDescription(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Popis výsledků vyhodnocení</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderEvaluationUsedSources(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Využitá družicová a další referenční data</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderEvaluationDescriptionOther(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Další komentář</h4>
				<p>{data}</p>
			</div>
		);
	}
}

export default ChangeReviewsTableRow;
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import Button from '../../../atoms/Button';
import ExpandRowButton from '../../../atoms/ExpandRowButton';
import Icon from '../../../atoms/Icon';

import LpisCaseStatuses, {order as LpisCaseStatusOrder} from '../../../../../constants/LpisCaseStatuses';

class ChangeReviewsTableRow extends React.PureComponent {

	static propTypes = {
		caseKey: PropTypes.number,
		changes: PropTypes.array,
		data: PropTypes.object,
		status: PropTypes.string,
		updated: PropTypes.string,
		showCase: PropTypes.func,
		userGroup: PropTypes.string
	};

	constructor(props){
		super(props);

		this.state = {
			detailsOpen: false
		};

		this.onDetailsClick = this.onDetailsClick.bind(this);
		this.onShowClick = this.onShowClick.bind(this);
	}

	onShowClick() {
		this.props.showCase(this.props.caseKey);
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

		let data = this.props.data;

		return (
			data ? (<div className={classes}>
				<div className="ptr-change-reviews-table-details-descriptions">
					<div className="ptr-change-reviews-table-details-section change">
						<h3>Ohlášení územní změny</h3>
						{data.change_description ? this.renderChangeDescription(data.change_description) : null}
						{data.change_description_place ? this.renderChangeDescriptionPlace(data.change_description_place) : null}
						{data.change_description_other ? this.renderChangeDescriptionOther(data.change_description_place) : null}
					</div>
					<div className="ptr-change-reviews-table-details-section evaluation">
						<h3>Výsledek vyhodnocení družicových dat</h3>
						{data.evaluation_result ? this.renderEvaluationResult(data.evaluation_result) : null}
						{data.evaluation_description ? this.renderEvaluationDescription(data.evaluation_description) : null}
						{data.evaluation_used_sources ? this.renderEvaluationUsedSources(data.evaluation_used_sources) : null}
						{data.evaluation_description_other ? this.renderEvaluationDescriptionOther(data.evaluation_description_other) : null}
					</div>
				</div>
				<div className="ptr-change-reviews-table-details-changes-info">
					<div className="ptr-change-reviews-table-details-section align-right">
						<h3>Poslední změna</h3>
						<div className="ptr-change-reviews-table-details-user">dromas</div>
						<div className="ptr-change-reviews-table-details-date">20. 12. 2017</div>
					</div>
				</div>
			</div>) : null
		);
	}

	renderChangeDescription(data){
		return (
			<div>
				<h4>Popis důvodu pro aktualizaci LPIS</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderChangeDescriptionPlace(data){
		return (
			<div>
				<h4>Určení místa změny v terénu</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderChangeDescriptionOther(data){
		return (
			<div>
				<h4>Další informace</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderEvaluationResult(data){
		return (
			<div>
				<h4>Závěr vyhodnocení</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderEvaluationDescription(data){
		return (
			<div>
				<h4>Popis výsledků vyhodnocení</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderEvaluationUsedSources(data){
		return (
			<div>
				<h4>Využitá družicová a další referenční data</h4>
				<p>{data}</p>
			</div>
		);
	}

	renderEvaluationDescriptionOther(data){
		return (
			<div>
				<h4>Další komentář</h4>
				<p>{data}</p>
			</div>
		);
	}
}

export default ChangeReviewsTableRow;
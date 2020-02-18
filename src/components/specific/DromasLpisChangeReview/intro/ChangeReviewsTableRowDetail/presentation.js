import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {utils} from '@gisatcz/ptr-utils'

import Button from '../../../../common/atoms/Button';
import ExpandRowButton from '../../../../common/atoms/ExpandRowButton';
import Icon from '../../../../common/atoms/Icon';
import Menu, {MenuItem} from "../../../../common/atoms/Menu";

import LpisCaseStatuses, {evaluationConclusions as LpisEvaluation} from '../../../../../constants/LpisCaseStatuses';

class ChangeReviewsTableRowDetail extends React.PureComponent {

	static propTypes = {
		createdByData: PropTypes.object,
		updatedByData: PropTypes.object,
		data: PropTypes.object,
		highlightedChangeDescription: PropTypes.string,
		onInvalidateClick: PropTypes.func,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		status: PropTypes.string,
		userGroup: PropTypes.string
	};

	constructor(props){
		super(props);
	}

	componentDidMount(){
		this.props.onMount();
	}

	componentWillUnmount(){
		this.props.onUnmount();
	}

	render(){
		let group = this.props.userGroup;
		let data = this.props.data;

		return (
			data ? (<div className="ptr-table-row-details ptr-change-reviews-table-details open">
				<div className={"ptr-change-reviews-table-details-top-bar"}>
					<div>
						{data.code_dpb ? this.renderCodeDpb(data.code_dpb) : null}
						{data.code_ji ? this.renderCodeJi(data.code_ji) : null}
						{this.props.createdByData ? this.renderCreatedBy(this.props.createdByData.data.name) : null}
						{group && (group === "gisatAdmins" || group === "gisatUsers") && this.props.updatedByData ? (this.renderLastChange(this.props.updatedByData.data.name)
						):null}
					</div>
					<div>
						<div className="ptr-change-reviews-table-details-top-bar-menu">
							{this.renderTopBarMenu()}
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
					{this.renderEvaluationResults(data)}
				</div>
			</div>) : null
		);
	}

	renderEvaluationResults(data){
		if (this.props.status === 'CREATED' || (
			(this.props.userGroup === 'szifUsers' || this.props.userGroup === 'szifAdmins') && (this.props.status === 'EVALUATION_CREATED')
		)
		){
			return null;
		} else {
			return (
				<div>
					<h3>Výsledek vyhodnocení družicových dat</h3>
					{data.evaluation_result ? this.renderEvaluationResult(data.evaluation_result) : null}
					{data.evaluation_description ? this.renderEvaluationDescription(data.evaluation_description) : null}
					{data.evaluation_used_sources ? this.renderEvaluationUsedSources(data.evaluation_used_sources) : null}
					{data.evaluation_description_other ? this.renderEvaluationDescriptionOther(data.evaluation_description_other) : null}
				</div>
			);
		}
	}

	renderTopBarMenu() {
		if (this.props.userGroup !== 'gisatUsers' && this.props.status !== 'INVALID') {
			return (
				<Button invisible icon="dots">
					<Menu bottom left>
						<MenuItem onClick={this.props.onInvalidateClick}>Zneplatnit záznam řízení</MenuItem>
					</Menu>
				</Button>
			);
		} else {
			return null;
		}
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

	renderLastChange(userName){
		return (
			<div className={"ptr-change-reviews-table-details-record last-changed"}>
				<h4>Poslední změna</h4>
				<span>{userName}</span>
			</div>
		);
	}

	renderCreatedBy(userName){
		return (
			<div className={"ptr-change-reviews-table-details-record created-by"}>
				<h4>Zadal</h4>
				<span>{userName}</span>
			</div>
		);
	}

	renderChangeDescription(data){
		return this.props.highlightedChangeDescription ? (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Popis důvodu pro aktualizaci LPIS</h4>
				<p dangerouslySetInnerHTML={{__html: this.props.highlightedChangeDescription}} className="highlighted"></p>
			</div>
		) : (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Popis důvodu pro aktualizaci LPIS</h4>
				{data}
			</div>
		);
	}

	renderChangeDescriptionPlace(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Určení místa změny v terénu</h4>
				{data}
			</div>
		);
	}

	renderChangeDescriptionOther(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Další informace</h4>
				{data}
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
				{data}
			</div>
		);
	}

	renderEvaluationUsedSources(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Využitá družicová a další referenční data</h4>
				{data}
			</div>
		);
	}

	renderEvaluationDescriptionOther(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Další komentář</h4>
				{data}
			</div>
		);
	}
}

export default ChangeReviewsTableRowDetail;
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import Menu, {MenuItem} from '../../../../../components/common/atoms/Menu';
import Button from "../../../../../components/common/atoms/Button";
import {evaluationConclusions} from "../../../../../constants/LpisCaseStatuses";
import User from "../../../../../components/common/atoms/User";
import utils from "../../../../../utils/utils";
import getAttachmentsBaseUrl from '../../helpers/attachments';

import './style.scss';

class SzifCaseTableRowDetail extends React.PureComponent {
	static propTypes = {
		caseKey: PropTypes.string,
		invalidateCase: PropTypes.func,
		status: PropTypes.string,
		caseSubmit: PropTypes.object,
		caseChange: PropTypes.object,
		codeDpb: PropTypes.string,
		changeDescription: PropTypes.string,
		highlightedKeys: PropTypes.object,
		changeDescriptionOther: PropTypes.string,
		changeDescriptionPlace: PropTypes.string,
		evaluationResult: PropTypes.string,
		evaluationDescription: PropTypes.string,
		evaluationDescriptionOther: PropTypes.string,
		evaluationUsedSources: PropTypes.string,
		userGroups: PropTypes.array,
		attachments: PropTypes.array,
	};

	constructor(props) {
		super(props);

		this.onInvalidateClick = this.onInvalidateClick.bind(this);
	}

	onInvalidateClick() {
		const {caseKey, invalidateCase} = this.props;
		invalidateCase(caseKey);
	}

	renderEvaluationResults() {
		const {status, userGroups, evaluationResult, evaluationDescription,evaluationDescriptionOther, evaluationUsedSources} = this.props;
		const evaluationResultValue = evaluationResult ? evaluationConclusions.find(c => c.value === evaluationResult.toUpperCase()).label : null;
		if (!userGroups || status === 'CREATED' || (
			(userGroups.includes('szifUsers') || userGroups.includes('szifAdmins') || userGroups.includes('szifRegionAdmins')) && (status === 'EVALUATION_CREATED')
		)
		){
			return null;
		} else {
			return (<div>
						<h4>Výsledek vyhodnocení družicových dat</h4>
						{evaluationResult ? this.renderItem("Závěr vyhodnocení", evaluationResultValue) : null}
						{evaluationDescription ? this.renderItem("Popis výsledků vyhodnocení", evaluationDescription, 'evaluationDescription') : null}
						{evaluationDescriptionOther ? this.renderItem("Další komentář", evaluationDescriptionOther, 'evaluationDescriptionOther') : null}
						{evaluationUsedSources ? this.renderEvaluationUsedSources(evaluationUsedSources) : null}
					</div>)
		}
	}

	renderEvaluationUsedSources(data){
		return (
			<div className="ptr-change-reviews-table-details-record">
				<h4>Využitá družicová a další referenční data</h4>
				{utils.renderParagraphWithSeparatedLines(data)}
			</div>
		);
	}

	renderTopBarMenu() {
		const {status, userGroups} = this.props;

		const isSzifUser = userGroups.includes('szifUsers') || userGroups.includes('szifAdmins') || userGroups.includes('szifRegionAdmins');
		const isCreated = status === 'CREATED'
		const isInvalid = status === 'INVALID'
		const isClosed = status === 'CLOSED'
		
		const isGisatAdmin = userGroups.includes('gisatAdmins');

		const showInvalidateButton = (isSzifUser && isCreated) || (isGisatAdmin && !isInvalid && !isClosed);
		if (showInvalidateButton) {
			return (
				<div className="">
					<Button onClick={()=>{}} icon="dots">
						<Menu bottom left>
							<MenuItem onClick={this.onInvalidateClick}>Zneplatnit záznam řízení</MenuItem>
						</Menu>
					</Button>
				</div>

			);
		} else {
			return null;
		}
	}
	render() {
		const {caseChange, caseSubmit} = this.props;
		const props = this.props;
		return (
			<div>
				<div className="szifLpisZmenovaRizeni-table-detail-top-bar">
					{props.codeDpb ? this.renderItem("Kód DPB", props.codeDpb, 'codeDpb') : null}
					{caseSubmit ? this.renderItem("Zadal", <User userKey={caseSubmit.userId}/>) : null}
					{caseChange ? this.renderItem("Poslední změna", <User userKey={caseChange.userId}/>) : null}
					<div>
						<div className="ptr-change-reviews-table-details-top-bar-menu">
							{this.renderTopBarMenu()}
						</div>
					</div>
				</div>
				<div className="szifLpisZmenovaRizeni-table-detail-descriptions">
					<div>
						<h4>Ohlášení územní změny</h4>
						{props.changeDescription ? this.renderItem("Popis důvodu pro aktualizaci LPIS", props.changeDescription, 'changeDescription') : null}
						{props.changeDescriptionPlace ? this.renderItem("Určení místa změny v terénu", props.changeDescriptionPlace, 'changeDescriptionPlace') : null}
						{props.changeDescriptionOther ? this.renderItem("Další informace", props.changeDescriptionOther, 'changeDescriptionOther') : null}
						{props.attachments ? this.renderAttachments(props.attachments) : null}
					</div>
					{
						this.renderEvaluationResults()
					}
				</div>
			</div>
		);
	}

	renderItem(title, value, highlightKey) {
		const highlighted = highlightKey && this.props.highlightedKeys[highlightKey];
		if(highlighted) {
			return (
				<div className="szifLpisZmenovaRizeni-table-detail-item">
					<div>{title}</div>
					<div dangerouslySetInnerHTML={{__html: highlighted}} className="highlighted"></div>
				</div>
			)
		} else {
			return (
				<div className="szifLpisZmenovaRizeni-table-detail-item">
					<div>{title}</div>
					<div>{value}</div>
				</div>
			)
		}
	}

	renderAttachments(attachments) {
		const attachmentsElms = attachments.map((attachment) => {
			return <div key={attachment.key}>
				<a href={`${getAttachmentsBaseUrl()}/${attachment.key}`} target={'_blank'}>
					{attachment.data.filename}
				</a>
			</div>
		})
		return (
			<div className="szifLpisZmenovaRizeni-table-detail-item">
				<div>Přílohy</div>
				<div>{attachmentsElms}</div>
			</div>
		)
	}

	renderSourcesItem(title, value) {
		const values = value.split(",");

		return (
			<div className="szifLpisZmenovaRizeni-table-detail-item">
				<div>{title}</div>
				<div>{values.map((value, index) => <div key={index}>{value}</div>)}</div>
			</div>
		);
	}
}

export default SzifCaseTableRowDetail;

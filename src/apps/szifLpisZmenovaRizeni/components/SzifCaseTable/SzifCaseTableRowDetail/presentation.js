import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import {evaluationConclusions} from "../../../../../constants/LpisCaseStatuses";
import User from "../../../../../components/common/atoms/User";

import './style.scss';

class SzifCaseTableRowDetail extends React.PureComponent {
	static propTypes = {
		caseKey: PropTypes.string,
		caseSubmit: PropTypes.object,
		caseChange: PropTypes.object,
		codeDpb: PropTypes.string,
		codeJi: PropTypes.string,
		changeDescription: PropTypes.string,
		highlightedChangeDescription: PropTypes.string,
		changeDescriptionOther: PropTypes.string,
		changeDescriptionPlace: PropTypes.string,
		evaluationResult: PropTypes.string,
		evaluationDescription: PropTypes.string,
		evaluationDescriptionOther: PropTypes.string,
		evaluationUsedSources: PropTypes.string,
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {caseChange, caseSubmit} = this.props;
		const props = this.props;
		const evaluationResultValue = props.evaluationResult ? evaluationConclusions.find(c => c.value === props.evaluationResult.toUpperCase()).label : null;
		return (
			<div>
				<div className="szifLpisZmenovaRizeni-table-detail-top-bar">
					{props.codeDpb ? this.renderItem("Kód DPB", props.codeDpb) : null}
					{props.codeJi ? this.renderItem("Kód JI", props.codeJi) : null}
					{caseSubmit ? this.renderItem("Zadal", <User userKey={caseSubmit.userId}/>) : null}
					{caseChange ? this.renderItem("Poslední změna", <User userKey={caseChange.userId}/>) : null}
				</div>
				<div className="szifLpisZmenovaRizeni-table-detail-descriptions">
					<div>
						<h4>Ohlášení územní změny</h4>
						{props.changeDescription ? this.renderChangeDescription() : null}
						{props.changeDescriptionPlace ? this.renderItem("Určení místa změny v terénu", props.changeDescriptionPlace) : null}
						{props.changeDescriptionOther ? this.renderItem("Další informace", props.changeDescriptionOther) : null}
					</div>
					<div>
						<h4>Výsledek vyhodnocení družicových dat</h4>
						{props.evaluationResult ? this.renderItem("Závěr vyhodnocení", evaluationResultValue) : null}
						{props.evaluationDescription ? this.renderItem("Popis výsledků vyhodnocení", props.evaluationDescription) : null}
						{props.evaluationUsedSources ? this.renderSourcesItem("Využitá družicová a další referenční data", props.evaluationUsedSources, "sources") : null}
					</div>
				</div>
			</div>
		);
	}

	renderChangeDescription() {
		return this.props.highlightedChangeDescription ? (
			<div className="szifLpisZmenovaRizeni-table-detail-item highlighted">
				<div>{"Popis důvodu pro aktualizaci LPIS"}</div>
				<div dangerouslySetInnerHTML={{__html: this.props.highlightedChangeDescription}}></div>
			</div>
		) : (
			<div className="szifLpisZmenovaRizeni-table-detail-item">
				<div>{"Popis důvodu pro aktualizaci LPIS"}</div>
				<div>{this.props.changeDescription}</div>
			</div>
		);
	}

	renderItem(title, value) {
		return (
			<div className="szifLpisZmenovaRizeni-table-detail-item">
				<div>{title}</div>
				<div>{value}</div>
			</div>
		);
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

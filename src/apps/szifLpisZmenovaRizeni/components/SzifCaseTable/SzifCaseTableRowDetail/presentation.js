import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

import './style.scss';

class SzifCaseTableRowDetail extends React.PureComponent {
	static propTypes = {
		caseKey: PropTypes.string,
		codeDpb: PropTypes.string,
		codeJi: PropTypes.string,
		changeDescription: PropTypes.string,
		changeDescriptionOther: PropTypes.string,
		changeDescriptionPlace: PropTypes.string,
		evaluationResult: PropTypes.string,
		evaluationDescription: PropTypes.string,
		evaluationDescriptionOther: PropTypes.string,
		evaluationUsedSources: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return (
			<div>
				<div className="szifLpisZmenovaRizeni-table-detail-top-bar">
					{props.codeDpb ? this.renderItem("Kód DPB", props.codeDpb) : null}
					{props.codeJi ? this.renderItem("Kód JI", props.codeJi) : null}
					{this.renderItem("Zadal", "Mirek ze SZIFu")}
					{this.renderItem("Poslední změna", "Lucka z Gisatu")}
				</div>
				<div className="szifLpisZmenovaRizeni-table-detail-descriptions">
					<div>
						<h4>Ohlášení územní změny</h4>
						{props.changeDescription ? this.renderItem("Popis důvodu pro aktualizaci LPIS", props.changeDescription) : null}
						{props.changeDescriptionPlace ? this.renderItem("Určení místa změny v terénu", props.changeDescriptionPlace) : null}
						{props.changeDescriptionOther ? this.renderItem("Další informace", props.changeDescriptionOther) : null}
					</div>
					<div>
						<h4>Výsledek vyhodnocení družicových dat</h4>
						{props.evaluationResult ? this.renderItem("Závěr vyhodnocení", props.evaluationResult) : null}
						{props.evaluationDescription ? this.renderItem("Popis výsledků vyhodnocení", props.evaluationDescription) : null}
						{props.evaluationUsedSources ? this.renderSourcesItem("Využitá družicová a další referenční data", props.evaluationUsedSources, "sources") : null}
					</div>
				</div>
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

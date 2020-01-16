import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import SzifCaseTableRow from "./SzifCaseTableRow";
import Button from "../../../../components/common/atoms/Button";
import Icon from "../../../../components/common/atoms/Icon";
import InputText from "../../../../components/common/atoms/Input/Input";
import fuzzysort from "fuzzysort";

const SEARCHABLE_CASE_KEYS = ['caseKey', 'changeDescription'];
const SEARCHABLE_CASE_KEYS_SOURCES = ['data.caseKey', 'data.changeDescription'];
const SEARCHING_RESULTS_LIMIT = 20;
const SEARCHING_SCORE_THRESHOLD = -10000;

function search(searchString, cases){
	let results = fuzzysort.go(searchString, cases, {
		threshold: SEARCHING_SCORE_THRESHOLD,
		limit: SEARCHING_RESULTS_LIMIT,
		keys: SEARCHABLE_CASE_KEYS_SOURCES
	});

	let records = [];
	results.forEach(result => {
		let record = {...result.obj};
		result.forEach((rec, i) => {
			let highlighted = fuzzysort.highlight(rec, '<i>', '</i>');
			if (highlighted){
				record[SEARCHABLE_CASE_KEYS[i] + '_highlighted'] = highlighted;
			}
		});
		records.push(record);
	});

	return records;
}

class SzifCaseTable extends React.PureComponent {
	static propTypes = {
		cases: PropTypes.array,
		switchScreen: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			filteredCases: null,
			searchString: null,
		};

		this.onSearchChange = this.onSearchChange.bind(this);
		this.switchScreen = props.switchScreen.bind(this, 'szifCaseForm');
	}

	componentDidMount() {
		this.props.onMount();
	}

	onSearchChange(searchString) {
		let filteredCases = [...this.props.cases];
		if (searchString && searchString !== "") {
			filteredCases = search(searchString, filteredCases);
		}

		this.setState({
			filteredCases,
			searchString
		});
	}

	render() {
		const cases = this.state.filteredCases || this.props.cases;

		return (
			<div className="szifLpisZmenovaRizeni-cases">
				<div className="szifLpisZmenovaRizeni-cases-header">
					<h1 className="szifLpisZmenovaRizeni-cases-title">Změnová řízení</h1>
					<div className="szifLpisZmenovaRizeni-cases-header-tools-container">
						<div className="szifLpisZmenovaRizeni-cases-header-tools">
							<InputText
								placeholder="Vyhledat"
								transparent
								onChange={this.onSearchChange}
								value={this.state.searchString}
							>
								<Icon icon="search"/>
							</InputText>
							<Button icon="plus" inverted ghost onClick={this.switchScreen}>Vytvořit řízení</Button>
						</div>
					</div>
				</div>
				<div className="szifLpisZmenovaRizeni-table">
					<div className="szifLpisZmenovaRizeni-table-header">
						<div className="szifLpisZmenovaRizeni-table-header-item">Status</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Název řízení</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Podáno</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Změněno</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Uzavřeno</div>
						<div className="szifLpisZmenovaRizeni-table-header-item buttons"></div>
					</div>
					<div className="szifLpisZmenovaRizeni-table-body">
						{cases && cases.map(reviewCase => {
							return this.renderRow(reviewCase);
						})}
					</div>
				</div>
			</div>
		);
	}
	
	renderRow(caseData) {
		return (
			<SzifCaseTableRow
				key={caseData.key}
				metadataKey={caseData.key}
				data={caseData.data}
				highlightedCaseKey={caseData.caseKey_highlighted}
				highlightedChangeDescription={caseData.changeDescription_highlighted}
			/>
		);
	}
}

export default SzifCaseTable;

import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import SzifCaseTableRow from "./SzifCaseTableRow";
import Button from "../../../../components/common/atoms/Button";
import Select from "../../../../components/common/atoms/Select/Select";
import Icon from "../../../../components/common/atoms/Icon";
import InputText from "../../../../components/common/atoms/Input/Input";
import fuzzysort from "fuzzysort";

const SEARCHABLE_CASE_KEYS = ['caseKey', 'changeDescription','changeDescriptionOther','changeDescriptionPlace','codeDpb','codeJi','evaluationDescription','evaluationDescriptionOther'];
const SEARCHABLE_CASE_KEYS_SOURCES = ['data.caseKey', 'data.changeDescription', 'data.changeDescriptionOther', 'data.changeDescriptionPlace', 'data.codeDpb', 'data.codeJi', 'data.evaluationDescription', 'data.evaluationDescriptionOther'];
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
		switchScreen: PropTypes.func,
		activeUserCanAddCase: PropTypes.bool,
		selectedStatus: PropTypes.array,
		userGroups: PropTypes.array,
		casesFilter: PropTypes.object,
		onMount: PropTypes.func,
		onChangeStatus: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			filteredCases: null,
			searchString: null,
		};

		this.onSearchChange = this.onSearchChange.bind(this);
		this.switchScreenForm = props.switchScreen.bind(this, 'szifCaseForm');
		this.switchScreenExplorer = props.switchScreen.bind(this, 'szifSentinelExplorer');
		this.onStatusChange = this.onStatusChange.bind(this);
	}

	componentDidMount() {
		const {onMount, casesFilter} = this.props;
		onMount(casesFilter);
	}

	onSearchChange(searchString) {
		const cases = this.props.cases || [];
		let filteredCases = [...cases];
		if (searchString && searchString !== "") {
			filteredCases = search(searchString, filteredCases);
		}

		this.setState({
			filteredCases,
			searchString
		});
	}

	onStatusChange(newFilter) {
		this.props.onChangeStatus(newFilter);
	}

	render() {
		const {casesLeft, activeUserCanAddCase, statusesOptions, selectedStatus} = this.props;
		const cases = this.state.filteredCases || this.props.cases;


		return (
			<div className="szifLpisZmenovaRizeni-cases">
				<div className="szifLpisZmenovaRizeni-cases-header">
					<div className={"szifLpisZmenovaRizeni-heading"}>
						<h1 className="szifLpisZmenovaRizeni-cases-title">Změnová řízení</h1>
						{
							(casesLeft && casesLeft > 0 ? 
								<p className={'szifLpisZmenovaRizeni-cases-header-item'}>{`Tento týden je možné vytvořit ${casesLeft} řízení.`}</p>
								: <p className={'szifLpisZmenovaRizeni-cases-header-item'}>Dosažen týdenní limit na vytvoření řízení.</p>)
						}
						<div style={{marginBottom: '1rem', marginLeft: '1rem'}}>
							<Button inverted ghost onClick={this.switchScreenExplorer} title={'Přeprout do režimu prohlížení sentinel dat'}>
								<div className={'ptr-button-create-case'}>
									{/* <Icon icon="plus" inverted/> */}
									<div className={'ptr-button-caption'}>
										Prohlížeč sentinel dat
									</div>
								</div>
							</Button>
						</div>
					</div>
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
							{activeUserCanAddCase ?
								(casesLeft && casesLeft > 0 ? <Button inverted ghost onClick={this.switchScreenForm} title={`Tento týden je možné vytvořit ${casesLeft} řízení.`}>
								<div className={'ptr-button-create-case'}>
									<Icon icon="plus" inverted/>
									<div className={'ptr-button-caption'}>
										Vytvořit řízení 
									</div>
								</div>
							</Button> : null) : null
							}
						</div>
					</div>
				</div>
				<div className="szifLpisZmenovaRizeni-table">
					<div className="szifLpisZmenovaRizeni-table-header">
						<div className="szifLpisZmenovaRizeni-table-header-item">
							<Select
								clearable={false}
								key="change-review-state-selector"
								onChange={this.onStatusChange}
								optionLabel = 'label'
								optionValue = 'value'			
								options={statusesOptions}
								placeholder="STAV"
								value={selectedStatus}
							/>
						</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Název řízení</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Podáno</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Změněno</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Uzavřeno</div>
						<div className="szifLpisZmenovaRizeni-table-header-item">Kód JI</div>
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
		const highlightedKeys = {};
		for(const [key, value] of Object.entries(caseData)) {
			if(key.includes('_highlighted')) {
				highlightedKeys[key.split("_highlighted")[0]] = value;
			}
		}
		return (
			<SzifCaseTableRow
				key={caseData.key}
				metadataKey={caseData.key}
				data={caseData.data}
				highlightedKeys={highlightedKeys}
			/>
		);
	}
}

export default SzifCaseTable;

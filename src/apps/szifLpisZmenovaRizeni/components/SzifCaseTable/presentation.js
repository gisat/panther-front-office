import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import SzifCaseTableRow from "./SzifCaseTableRow/presentation";
import Button from "../../../../components/common/atoms/Button";

class SzifCaseTable extends React.PureComponent {
	static propTypes = {
		cases: PropTypes.array,
		switchScreen: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.switchScreen = props.switchScreen.bind(this, 'szifCaseForm');
	}

	componentDidMount() {
		this.props.onMount();
	}

	render() {
		return (
			<div className="szifLpisZmenovaRizeni-table-container">
				<div>
					<Button onClick={this.switchScreen}>Vytvořit řízení</Button>
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
						{this.props.cases && this.props.cases.map(reviewCase => {
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
				key={caseData.data.caseKey}
				data={caseData.data}
			/>
		);
	}
}

export default SzifCaseTable;

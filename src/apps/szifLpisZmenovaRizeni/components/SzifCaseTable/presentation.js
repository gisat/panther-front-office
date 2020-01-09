import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style.scss';
import SzifCaseTableRow from "./SzifCaseTableRow/presentation";

class SzifCaseTable extends React.PureComponent {
	static propTypes = {
		cases: PropTypes.array
	};

	render() {
		return (
			<div className="szifLpisZmenovaRizeni-case-table">
				<div className="szifLpisZmenovaRizeni-case-table-header">
					<div className="szifLpisZmenovaRizeni-case-table-header-item">Status</div>
					<div className="szifLpisZmenovaRizeni-case-table-header-item">Název řízení</div>
					<div className="szifLpisZmenovaRizeni-case-table-header-item">Podáno</div>
					<div className="szifLpisZmenovaRizeni-case-table-header-item">Změněno</div>
					<div className="szifLpisZmenovaRizeni-case-table-header-item">Uzavřeno</div>
					<div className="szifLpisZmenovaRizeni-case-table-header-item buttons"></div>
				</div>
				<div className="szifLpisZmenovaRizeni-case-table-body">
					{this.props.cases.map(reviewCase => {
						return this.renderRow(reviewCase);
					})}
				</div>
			</div>
		);
	}
	
	renderRow(caseData) {
		return (
			<SzifCaseTableRow
				data={caseData.data}
			/>
		);
	}
}

export default SzifCaseTable;

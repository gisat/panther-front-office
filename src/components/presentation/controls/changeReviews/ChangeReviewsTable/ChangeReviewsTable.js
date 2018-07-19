import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '../../../atoms/Button';
import ChangeReviewsTableRow from './ChangeReviewsTableRow';
import Icon from '../../../atoms/Icon';
import './ChangeReviewsTable.css';

class ChangeReviewsTable extends React.PureComponent {

	static propTypes = {
		cases: PropTypes.array
	};

	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="ptr-table change-reviews-table">
				<div className="ptr-table-header">
					<div className="ptr-table-header-item">Stav</div>
					<div className="ptr-table-header-item">Spisová značka</div>
					<div className="ptr-table-header-item">Zadáno</div>
					<div className="ptr-table-header-item">Aktualizováno</div>
					<div className="ptr-table-header-item buttons"></div>
				</div>
				<div className="ptr-table-body">
					{this.props.cases.map(reviewCase => {
						return this.renderRow(reviewCase);
					})}
				</div>
			</div>
		);
	}

	renderRow(reviewCase){
		return (
			<ChangeReviewsTableRow
				caseKey={reviewCase.key}
				changes={reviewCase.changes}
				data={reviewCase.data}
				key={reviewCase.key}
				status={reviewCase.status}
				updated={reviewCase.updated}
			/>
		);
	}
}

export default ChangeReviewsTable;
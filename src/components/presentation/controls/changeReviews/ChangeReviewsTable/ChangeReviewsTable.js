import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '../../../atoms/Button';
import ChangeReviewsTableRow from './ChangeReviewsTableRow';
import {statusesOptions} from '../../../../../constants/LpisCaseStatuses';
import Icon from '../../../atoms/Icon';
import UISelect from "../../../atoms/UISelect/UISelect";

import './ChangeReviewsTable.css';

class ChangeReviewsTable extends React.PureComponent {

	static propTypes = {
		cases: PropTypes.array,
		invalidateCase: PropTypes.func,
		onStatusChange: PropTypes.func,
		showCase: PropTypes.func,
		selectedStatus: PropTypes.string,
		userGroup: PropTypes.string,
		users: PropTypes.array
	};

	constructor(props){
		super(props);
		this.onStatusChange = this.onStatusChange.bind(this);
	}

	onStatusChange(status){
		this.props.onStatusChange(status ? status.value : null);
	}

	render() {
		return (
			<div className="ptr-table change-reviews-table">
				<div className="ptr-table-header">
					<div className="ptr-table-header-item">
						<UISelect
							clearable
							inverted
							key="change-review-state-selector"
							onChange={this.onStatusChange}
							options={statusesOptions}
							placeholder="STAV"
							value={this.props.selectedStatus}
						/>
					</div>
					<div className="ptr-table-header-item">Spisová značka</div>
					<div className="ptr-table-header-item">Podáno</div>
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
				updatedBy={reviewCase.updatedBy}
				showCase={this.props.showCase}
				invalidateCase={this.props.invalidateCase}
				userGroup={this.props.userGroup}
				users={this.props.users}
			/>
		);
	}
}

export default ChangeReviewsTable;
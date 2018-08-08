import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '../../../atoms/Button';
import ExpandRowButton from '../../../atoms/ExpandRowButton';
import Icon from '../../../atoms/Icon';

import LpisCaseStatuses, {order as LpisCaseStatusOrder} from '../../../../../constants/LpisCaseStatuses';

class ChangeReviewsTable extends React.PureComponent {

	static propTypes = {
		caseKey: PropTypes.number,
		changes: PropTypes.array,
		data: PropTypes.object,
		status: PropTypes.string,
		updated: PropTypes.string,
		showCase: PropTypes.func
	};

	constructor(props){
		super(props);

		this.state = {
			detailsOpen: false
		};

		this.onDetailsClick = this.onDetailsClick.bind(this);
		this.onShowClick = this.onShowClick.bind(this);
	}

	onShowClick() {
		this.props.showCase(this.props.caseKey);
	}

	onDetailsClick(){
		this.setState({
			detailsOpen: !this.state.detailsOpen
		});
	}

	render(){
		let classes = classNames("ptr-table-row", {
			active: this.state.detailsOpen
		});

		return (
			<div className={classes}>
				<div className="ptr-table-row-record">
					{this.renderStatus()}
					<div className="ptr-table-row-item">{this.props.data.code_dpb}</div>
					<div className="ptr-table-row-item">{this.props.data.submit_date}</div>
					<div className="ptr-table-row-item">{this.props.updated}</div>
					<div className="ptr-table-row-item buttons">
						<div className="ptr-table-row-action">
							<Button
								small
								onClick={this.onShowClick}
							>
								Zobrazit
							</Button>
						</div>
						<ExpandRowButton
							invisible
							expanded={this.state.detailsOpen}
							onClick={this.onDetailsClick}
						/>
					</div>
				</div>
				{this.renderDetails()}
			</div>
		);
	}

	renderDetails(){
		let classes = classNames(
			"ptr-table-row-details", {
				open: this.state.detailsOpen
			}
		);

		return (
			<div className={classes}>
				{"Místo: " + this.props.data.change_description_place}
			</div>
		);
	}

	renderStatus(){
		let status = LpisCaseStatuses[this.props.status];
		let caption = null;
		let colour = null;
		let opacity = status.database === 'CLOSED' ? 0 : null;
		if (this.props.userGroup === 'gisatUsers' || this.props.userGroup === 'gisatAdmins') {
			caption = status.gisatName;
			colour = status.gisatColour || status.colour;
		} else {
			caption = status.szifName;
			colour = status.colour;
		}

		return (
			<div className="ptr-table-row-item state">
				<Icon icon="circle" color={colour} opacity={opacity}/>
				{caption}
			</div>
		);
	}
}

export default ChangeReviewsTable;
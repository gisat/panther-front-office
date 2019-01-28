import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Button from '../../../../presentation/atoms/Button';
import Icon from '../../../../presentation/atoms/Icon';


class ChangeReviewsTableRow extends React.PureComponent {

	static propTypes = {
		data: PropTypes.object,
		showCase: PropTypes.func,
		caseKey: PropTypes.number,
	};

	constructor(props){
		super(props);
		this.onShowClick = this.onShowClick.bind(this);
	}

	onShowClick() {
		this.props.showCase(this.props.caseKey);
	}

	render(){
		let classes = classNames("ptr-table-row", {});

		let showMapButton = this.renderShowMapButton();

		return (
			<div className={classes}>
				<div className="ptr-table-row-record">
					{/* {this.renderVisibleStatus()} */}
					{/* {this.renderConfirmStatus()} */}
					{/* {this.renderCaseKey()} */}
					<div className="ptr-table-row-item">
						{this.props.data.nkod_dpb}
					</div>
					<div className="ptr-table-row-item">
						{this.props.data.kulturakod}
					</div>
					<div className="ptr-table-row-item">
						{this.props.data.typ ? this.props.data.typ : null}
						{this.props.data.poznamka ? this.props.data.poznamka : null}
					</div>
					<div className="ptr-table-row-item buttons">
						<div className="ptr-table-row-action">
							{showMapButton}
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderVisibleStatus(){
		const visible = this.props.data.visited === true;
		const color = visible ? 'green' : 'red';
		const status = visible ? 'Prohlédnuto' : 'Neprohlédnuto';
		return (
			<div className="ptr-table-row-item state">
				<Icon icon="circle" color={color} opacity={50}/>
				{status}
			</div>
		);
	}
	renderConfirmStatus(){
		const confirmed = this.props.data.confirmed === true;
		const color = confirmed ? 'green' : 'red';
		const status = confirmed ? 'Schváleno' : 'Zamítnuto';
		return (
			<div className="ptr-table-row-item state">
				<Icon icon="circle" color={color} opacity={50}/>
				{status}
			</div>
		);
	}

	renderCaseKey(){
		return (
		<div className="ptr-table-row-item state">
			{this.props.data.nkod_dpb}
		</div>
		)
	}

	renderShowMapButton(){
		return (
			<Button
				small
				onClick={this.onShowClick}
			>
				Zobrazit
			</Button>
		);
	}
}

export default ChangeReviewsTableRow;
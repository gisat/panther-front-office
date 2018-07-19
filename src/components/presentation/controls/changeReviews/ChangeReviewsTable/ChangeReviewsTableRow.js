import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '../../../atoms/Button';
import Icon from '../../../atoms/Icon';

class ChangeReviewsTable extends React.PureComponent {

	static propTypes = {
		caseKey: PropTypes.number,
		changes: PropTypes.array,
		data: PropTypes.object,
		status: PropTypes.string,
		updated: PropTypes.string
	};

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="ptr-table-row">
				<div className="ptr-table-row-record">
					{this.renderStatus()}
					<div className="ptr-table-row-item">{this.props.data.code_dpb}</div>
					<div className="ptr-table-row-item">{this.props.data.submit_date}</div>
					<div className="ptr-table-row-item">{this.props.updated}</div>
					<div className="ptr-table-row-item buttons">
						<div className="ptr-table-row-action">
							<Button small>Zobrazit</Button>
						</div>
						<div className="ptr-table-row-show-details"><Icon icon="dots" /></div>
					</div>
				</div>
			</div>
		);
	}

	renderStatus(){
		let color = null;
		let name = null;
		switch(this.props.status){
			case 'created':
				color = 'red';
				name = 'Zadáno';
				break;
			case 'prepared':
				color = 'orange';
				name = 'Připraveno';
				break;
			case 'approved':
				color = 'green';
				name = 'Schváleno';
				break;
			default:
				color = 'black';
				name = 'Bez statusu';
		}

		return (
			<div className="ptr-table-row-item state">
				<Icon icon="circle" color={color}/>
				{name}
			</div>
		);
	}
}

export default ChangeReviewsTable;
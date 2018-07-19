import React from 'react';
import classNames from 'classnames';
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

		this.state = {
			detailsOpen: false
		};

		this.onDetailsClick = this.onDetailsClick.bind(this);
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
								small>
								Zobrazit
							</Button>
						</div>
						<div onClick={this.onDetailsClick} className="ptr-table-row-show-details"><Icon icon="dots" /></div>
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
				Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Donec iaculis gravida nulla. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Nulla est. Praesent in mauris eu tortor porttitor accumsan. Integer imperdiet lectus quis justo. Duis risus. Maecenas libero. Nullam faucibus mi quis velit. Donec iaculis gravida nulla. Sed elit dui, pellentesque a, faucibus vel, interdum nec, diam. Integer tempor. Nulla est. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nullam dapibus fermentum ipsum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Donec iaculis gravida nulla. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Nulla est. Praesent in mauris eu tortor porttitor accumsan. Integer imperdiet lectus quis justo. Duis risus. Maecenas libero. Nullam faucibus mi quis velit. Donec iaculis gravida nulla. Sed elit dui, pellentesque a, faucibus vel, interdum nec, diam. Integer tempor. Nulla est. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nullam dapibus fermentum ipsum.
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
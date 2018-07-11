import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ViewCard.css';

import Icon from '../../atoms/Icon';
import viewUtils from "../../../../util/viewUtils";

class ViewCard extends React.PureComponent {

	static propTypes = {
		data: PropTypes.object,
		deletable: PropTypes.bool,
		editable: PropTypes.bool,
		onClick: PropTypes.func,
		viewKey: PropTypes.number
	};

	constructor(props){
		super(props);

		this.onDelete = this.onDelete.bind(this);
		this.onEdit = this.onEdit.bind(this);
	}

	onDelete(e){
		e.stopPropagation();
		// todo handle delete
	}

	onEdit(e){
		e.stopPropagation();
		// todo handle edit
	}

	render() {
		let name = this.props.data.name ? this.props.data.name : "Dataview " + this.props.viewKey;
		let description = this.props.data.description ? this.props.data.description : "Dataview " + this.props.viewKey;

		let previewStyle = {
			backgroundImage: 'linear-gradient(135deg, ' + viewUtils.getPseudorandomColor() + ' 0%, ' + viewUtils.getPseudorandomColor() + ' 100%)'
		};

		return (
			<div onClick={this.props.onClick.bind(this, this.props)} className="view-card">
				<div style={previewStyle} className="view-card-preview"></div>
				<div className="view-card-text">
					<h3 className="view-card-title">{name}</h3>
					<p className="view-card-description">{description}</p>
				</div>
				{this.renderTools()}
			</div>
		);
	}

	renderTools(){
		return (
			<div className="view-card-tools">
				{this.props.editable ? <div onClick={this.onEdit} className="view-card-tool disabled"><Icon icon="edit"/></div> : null}
				{this.props.deletable ? <div onClick={this.onDelete} className="view-card-tool disabled"><Icon icon="delete"/></div> : null}
			</div>
		);
	}
}

export default ViewCard;
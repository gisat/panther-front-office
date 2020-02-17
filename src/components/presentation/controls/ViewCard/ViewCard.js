import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from "panther-utils"

import './ViewCard.css';

import Icon from '../../../common/atoms/Icon';
import viewUtils from "../../../../util/viewUtils";
import Names from "../../../../constants/Names";

class ViewCard extends React.PureComponent {

	static propTypes = {
		data: PropTypes.object,
		deletable: PropTypes.bool,
		deleteView: PropTypes.func,
		editable: PropTypes.bool,
		public: PropTypes.bool,
		redirect: PropTypes.func,
		viewKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
	};

	constructor(props){
		super(props);

		this.onDelete = this.onDelete.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onRedirect = this.onRedirect.bind(this);
	}

	onDelete(e){
		e.stopPropagation();
		let name = this.props.data.name;
		if (window.confirm(Names.VIEWS_DELETE_CONFIRM_MESSAGE + ' ' + (name ? name : 'View ' + this.props.viewKey))) {
			this.props.deleteView();
		}
	}

	onEdit(e){
		e.stopPropagation();
		// todo handle edit
	}

	onRedirect(){
		this.props.redirect();

	}

	render() {
		let name = this.props.data.name ? this.props.data.name : "Dataview " + this.props.viewKey;
		let description = this.props.data.description ? this.props.data.description : "Dataview " + this.props.viewKey;

		let gradient = utils.stringToColours(this.props.viewKey, 2, {saturation: [30,45], lightness: [55,70]});
		let previewStyle = {
			backgroundImage: 'linear-gradient(135deg, ' + gradient[0] + ' 0%, ' + gradient[1] + ' 100%)'
		};

		return (
			<div onClick={this.onRedirect} className="view-card">
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
				{this.props.deletable ? <div onClick={this.onDelete} className="view-card-tool"><Icon icon="delete"/></div> : null}
			</div>
		);
	}
}

export default ViewCard;
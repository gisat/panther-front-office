import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ViewCard.css';
import viewUtils from "../../../../util/viewUtils";

class ViewCard extends React.PureComponent {

	static propTypes = {
		data: PropTypes.object,
		onClick: PropTypes.func,
		viewKey: PropTypes.number
	};

	constructor(props){
		super(props);
	}

	render() {
		let name = this.props.data.name ? this.props.data.name : "Dataview " + this.props.viewKey;
		let description = this.props.data.description ? this.props.data.description : "Dataview " + this.props.viewKey;

		let previewStyle = {
			backgroundImage: 'linear-gradient(135deg, ' + viewUtils.getPseudorandomColor() + ' 0%, ' + viewUtils.getPseudorandomColor() + ' 100%)'
		};

		return (
			<div onClick={this.props.onClick.bind(this, this.props)} className="view-card" tabIndex={0}>
				<div style={previewStyle} className="view-card-preview"></div>
				<div className="view-card-text">
					<h3 className="view-card-title">{name}</h3>
					<p className="view-card-description">{description}</p>
				</div>
				<div className="view-card-tools"></div>
			</div>
		);
	}
}

export default ViewCard;
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ViewsList.css';
import ViewCard from "../ViewCard/ViewCard";

class ViewsList extends React.PureComponent {

	static propTypes = {
		selectedScope: PropTypes.object,
		views: PropTypes.array
	};

	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="ptr-views-list">
				<h2 className="view-list-title">{this.props.selectedScope ? this.props.selectedScope.name : null}</h2>
				<div className="view-list-content">{this.renderViews()}</div>
			</div>
		);
	}

	renderViews(){
		return this.props.views.map(view => {
			return <ViewCard key={view.key} viewKey={view.key} data={view.conf}/>
		});
	}
}

export default ViewsList;
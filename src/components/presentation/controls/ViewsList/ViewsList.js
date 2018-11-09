import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './ViewsList.css';
import ViewCard from "../../../containers/controls/ViewCard";
import Names from "../../../../constants/Names";

class ViewsList extends React.PureComponent {

	static propTypes = {
		hideTitle: PropTypes.bool,
		isIntro: PropTypes.bool,
		selectedScope: PropTypes.object,
		views: PropTypes.array,
	};

	constructor(props){
		super(props);

	}

	render() {
		return (
			<div className="ptr-views-list">
				{(this.props.hideTitle || !this.props.isIntro) ? null : (<h2 className="view-list-title">{this.props.selectedScope ? this.props.selectedScope.name : null}</h2>)}
				<div className="view-list-content">{this.renderViews()}</div>
			</div>
		);
	}

	renderViews(){
		return this.props.views.length ? (this.props.views.map(view => {
			return <ViewCard
				key={view.key}
				viewKey={view.key}
				data={view.data}
				editable={view.editable}
				deletable={view.deletable}
			/>
		})) : (<div className="no-view-message">{Names.VIEWS_NO_VIEW_FOR_SCOPE}</div>);
	}
}

export default ViewsList;
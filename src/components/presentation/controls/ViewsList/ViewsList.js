import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './ViewsList.css';
import ViewCard from "../../../containers/controls/ViewCard";
import Names from "../../../../constants/Names";
import VisualConfig from "../../../../constants/VisualsConfig";

class ViewsList extends React.PureComponent {

	static propTypes = {
		hideTitle: PropTypes.bool,
		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
		selectedScope: PropTypes.object,
		views: PropTypes.array,
	};

	constructor(props) {
		super(props);

	}

	componentDidMount() {
		this.props.onMount();
	}

	componentWillUnmount() {
		this.props.onUnmount();
	}

	render() {
		return (
			<div className="ptr-views-list">
				{this.props.hideTitle ? null : this.renderTitle()}
				{this.props.selectedScope && this.props.selectedScope.data &&  this.props.selectedScope.data.description ? this.renderDescription() : null}
				<div className="ptr-views-list-content">{this.renderViews()}</div>
			</div>
		);
	}

	renderTitle(){
		let style = this.props.selectedScope && this.props.selectedScope.data && this.props.selectedScope.data.configuration && this.props.selectedScope.data.configuration.style;
		if (style && VisualConfig[style] && VisualConfig[style].introLogoSrc){
			return (
				<div className="ptr-views-list-tilte-container">
					<h2 className="ptr-views-list-title">{this.props.selectedScope && this.props.selectedScope.data ? this.props.selectedScope.data.name : null}</h2>
					<img className="ptr-views-list-logo" src={VisualConfig[style].introLogoSrc}/>
				</div>
				);
		} else {
			return (<h2 className="ptr-views-list-title">{this.props.selectedScope  && this.props.selectedScope.data ? this.props.selectedScope.data.name : null}</h2>);
		}
	}

	renderDescription() {
		return (
			<div className="ptr-views-list-description" dangerouslySetInnerHTML={{__html: this.props.selectedScope.data.description}}>
			</div>
		);
	}

	renderViews(){
		return this.props.views && this.props.views.length ? (this.props.views.map(view => {
			return (view && view.data) ? (<ViewCard
				key={view.key}
				viewKey={view.key}
				data={view.data}
				editable={view.permissions && view.permissions.activeUser && view.permissions.activeUser.update}
				deletable={view.permissions && view.permissions.activeUser && view.permissions.activeUser.delete}
				public={view.permissions && view.permissions.guest && view.permissions.guest.get}
			/>) : null
		})) : (<div className="no-view-message">{Names.VIEWS_NO_VIEW_FOR_SCOPE}</div>);
	}
}

export default ViewsList;
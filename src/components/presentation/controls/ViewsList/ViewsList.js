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
				{(this.props.hideTitle || !this.props.isIntro) ? null : this.renderTitle()}
				{this.props.selectedScope && this.props.selectedScope.description ? this.renderDescription() : null}
				<div className="ptr-views-list-content">{this.renderViews()}</div>
			</div>
		);
	}

	renderTitle(){
		let style = this.props.selectedScope && this.props.selectedScope.configuration && this.props.selectedScope.configuration.style;
		if (style && VisualConfig[style] && VisualConfig[style].introLogoSrc){
			return (
				<div className="ptr-views-list-tilte-container">
					<h2 className="ptr-views-list-title">{this.props.selectedScope ? this.props.selectedScope.name : null}</h2>
					<img className="ptr-views-list-logo" src={VisualConfig[style].introLogoSrc}/>
				</div>
				);
		} else {
			return (<h2 className="ptr-views-list-title">{this.props.selectedScope ? this.props.selectedScope.name : null}</h2>);
		}
	}

	renderDescription() {
		return (
			<div className="ptr-views-list-description" dangerouslySetInnerHTML={{__html: this.props.selectedScope.description}}>
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
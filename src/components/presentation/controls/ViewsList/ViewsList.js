import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './ViewsList.css';
import ViewCard from "../../../containers/controls/ViewCard";
import Names from "../../../../constants/Names";
import VisualConfig from "../../../../constants/VisualsConfig";
import PucsClimateFitIntroHeader from "../../../scopeSpecific/PucsClimateFit/introHeader/presentation";

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
		let withoutHeader = (this.props.hideTitle || !this.props.isIntro);

		return (
			<div className="ptr-views-list">
				{withoutHeader ? null : this.renderViewsHeader()}
				<div className="ptr-views-list-content">{this.renderViewsContent()}</div>
			</div>
		);
	}

	renderViewsHeader(){
		let scopeStyle = this.props.selectedScope && this.props.selectedScope.configuration && this.props.selectedScope.configuration.style;

		if (scopeStyle === "pucs"){
			return (
				<PucsClimateFitIntroHeader
					title={this.props.selectedScope.name}
					description={this.props.selectedScope.description}
					backgroundSource={scopeStyle && VisualConfig[scopeStyle] && VisualConfig[scopeStyle].introHeaderBackgroundSrc}
					logoSource={scopeStyle && VisualConfig[scopeStyle] && VisualConfig[scopeStyle].introLogoSrc}
				/>
			);
		} else {
			let headerLogo = scopeStyle && VisualConfig[scopeStyle] && VisualConfig[scopeStyle].introLogoSrc;
			let description = this.props.selectedScope && this.props.selectedScope.description;


			return (
				<div className="ptr-views-list-header">
					<div className="ptr-views-list-tilte-container">
						<h2 className="ptr-views-list-title">{this.props.selectedScope ? this.props.selectedScope.name : null}</h2>
						{headerLogo ? (<img className="ptr-views-list-logo" src={headerLogo}/>) : null}
					</div>
					{description ? (
						<div
							className="ptr-views-list-description"
							dangerouslySetInnerHTML={{__html: description}}
						>
						</div>
					) : null}
				</div>
			);
		}
	}

	renderViewsContent(){
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
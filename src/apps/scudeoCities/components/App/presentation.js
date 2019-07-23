import React from "react";
import Helmet from "react-helmet";
import _ from 'lodash';

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapControls from "../../../../components/common/maps/MapControls";
import MapControlLegend from "../../../../components/common/maps/MapControlLegend";
import MapTools from "../../../../components/common/maps/MapTools";


import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import Header from '../Header';
import Highlights from "../Highlights";
import Sidebar from "../Sidebar";

class App extends React.PureComponent {
	
	componentDidMount() {
		this.props.onMount && this.props.onMount();
	}
	
	componentWillUnmount() {
		this.props.onUnmount && this.props.onUnmount();
	}

	render() {
		const props = this.props;
		const contentKey = props.match.params.contentKey || 'highlights';

		return (
			<>
				<Helmet><title>{props.activePlace ? props.activePlace.data.nameDisplay : null}</title></Helmet>
				<Header	contentKey={contentKey} match={props.match} />
				<div className="scudeoCities-content">{this.renderContent(contentKey)}</div>
			</>
		);
	}
	
	renderContent(content) {
		switch (content) {
			case 'highlights':
				return (<Highlights />);
			case 'explore':
				return (
					<AdjustableColumns
						fixed
						content={[
							{
								// component: MapSet,
								props: {
									mapSetKey: "scudeoCities"
								}
							},
							{
								width: "40%",
								minWidth: "20rem",
								maxWidth: "35rem",
								component: Sidebar,
								className: "scudeoCities-column-sidebar"
							},
						]}
					/>
				);
		}
	}
}


export default App;
import React from "react";
import Helmet from "react-helmet";
import _ from 'lodash';

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
// import MapControls from "../../../../components/common/maps/MapControls";
import MapTools from "../../../../components/common/maps/controls/MapTools";


import ReactResizeDetector from 'react-resize-detector';
import {HoverHandler} from "@gisatcz/ptr-core";
import Header from '../Header';
import Highlights from "../Highlights";
import Sidebar from "../Sidebar";
import WorldWindMap from "../../../../components/common/maps/WorldWindMap/presentation";
import MapControls from "../../../../components/common/maps/controls/MapControls/presentation";
import Deprecated_PresentationMapWithControls from "../../../../components/common/maps/Deprecated_PresentationMapWithControls";

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
								// component: Map,
								// props: {
								// 	// mapKey: "scudeoCities",
								// 	mapComponent: WorldWindMap
								// },
								render: () => (
									<Deprecated_PresentationMapWithControls
										map={(
											<WorldWindMap
												backgroundLayer={{
													key: 'stamen-lite',
													type: 'wmts',
													options: {
														url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
													}
												}}
												layers={[
													{
														key: 'lulc-vhr-level-1',
														name: 'LULC (VHR) - Level 1',
														type: 'wms',
														opacity: 0.8,
														options: {
															url: 'https://urban-tep.eu/puma/backend/geoserver/wms',
															params: {
																layers: 'geonode:i82049_eo4sd_dhaka_lulcvhr_2017_clp_ar',
																styles: 'EO4SD_LULC_Level_1'
															}
														}
													}
												]}
												view={{
													center: {
														lat: 23.78,
														lon: 90.41
													},
													boxRange: 60035
												}}
											/>
										)}
										controls={(
											<MapControls/>
										)}
									/>
								)
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
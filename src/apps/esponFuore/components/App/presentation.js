import React from "react";
import Helmet from "react-helmet";
import _ from 'lodash';

import AppContext from '../../context';

import LandingPage from '../LandingPage';
import Header from '../Header';
import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/Deprecated_MapSet";
import FuoreMap from "./Map";
import FuoreMapPresentation from "./Map/presentation";
import MapControls from "../../../../components/common/maps/Deprecated_MapControls";
import MapControlLegend from "./Map/MapControlLegend";
import MapTools from "../../../../components/common/maps/MapTools";
import ChartSet from '../../../../components/common/charts/ChartSet';
import EsponFuoreTimeline from "./Timeline";
import EsponFuoreChart from "./Charts/EsponFuoreChart";

import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";
import SimpleLayersControl from "../../../../components/common/maps/SimpleLayersControl/presentation";

const backgroundLayers = [
	{
		key: 'wikimedia',
		type: 'wikimedia',
		name: 'Wikimedia',
		thumbnail: 'wikimedia' // TODO get this information from layer template?
	}, {
		key: 'bingAerial',
		type: 'bingAerial',
		name: 'Aerial',
		thumbnail: 'bingAerial'
	}
];

class EsponFuoreApp extends React.PureComponent {
	static contextType = AppContext;

	constructor() {
		super();
		this.state = {
			chartsHeight: 300,
			chartsWidth: 500,
			backgroundLayers: [backgroundLayers[0]]
		};

		this.onBackgroundLayerChange = this.onBackgroundLayerChange.bind(this);
	}

	onBackgroundLayerChange(key) {
		let selectedLayers = _.filter(backgroundLayers, {key});
		if (selectedLayers) {
			this.setState({backgroundLayers: selectedLayers});
		}
	}

	render() {
		const props = this.props;

		const allowLegend = props.attribute && props.attribute.data;

		if (!props.activeScopeKey) {

			return React.createElement(LandingPage);

		} else {

			return (
				<div className="esponFuore-app">
					<HoverHandler>
						<Helmet><title>{props.activeScope ? props.activeScope.data.nameDisplay : null}</title></Helmet>
						<Header />
						<div className="esponFuore-content">
							<WindowsContainer setKey={this.context.windowSetKey}>
								<AdjustableColumns
									fixed
									content={[
										{
											render: props => (
												<ReactResizeDetector
													handleWidth
													handleHeight
													render={({ width, height }) => {return (
														<>
															<MapSet
																mapSetKey={this.context.mapSetKey}
																activeAttributeKey={this.props.activeAttributeKey}
																layerTreesFilter={{applicationKey: 'esponFuore', scopeKey: this.props.activeScopeKey}}
																width={width}
																height={height}
															>
																<FuoreMap
																	backgroundLayer={this.state.backgroundLayers}
																>
																	<FuoreMapPresentation />
																</FuoreMap>
															</MapSet>
															<MapTools>
																<SimpleLayersControl
																	layers={backgroundLayers}
																	activeLayer={this.state.backgroundLayers[0]}
																	onSelect={this.onBackgroundLayerChange}
																/>
																<MapControlLegend
																	disabled = {!allowLegend}
																	setKey={this.context.windowSetKey}
																	windowSetKey={this.context.windowSetKey}
																	itemKey={"legend"}
																	mapSetKey={this.context.mapSetKey}
																/>
																<MapControls zoomOnly/>
															</MapTools>
														</>
														)
													}}
												/>
											)
										},
										{
											width: "40%",
											minWidth: "20rem",
											maxWidth: "45rem",
											render: props => (
												<ChartSet
													setKey="esponFuoreCharts"
												>
													<EsponFuoreChart/>
												</ChartSet>
												)
										},
									]}
								/>
								<EsponFuoreTimeline
									mapSetKey={this.context.mapSetKey}
								/>
							</WindowsContainer>
						</div>
					</HoverHandler>
				</div>
			);
		}
	}
}


export default EsponFuoreApp;
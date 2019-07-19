import React from "react";
import Helmet from "react-helmet";

import AppContext from '../../context';

import LandingPage from '../LandingPage';
import Header from '../Header';
import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import FuoreMap from "./Map";
import FuoreMapPresentation from "./Map/presentation";
import MapControls from "../../../../components/common/maps/Deprecated_MapControls";
import MapControlLegend from "../../../../components/common/maps/MapControlLegend";
import MapTools from "../../../../components/common/maps/MapTools";
import ChartSet from '../../../../components/common/charts/ChartSet';
import EsponFuoreTimeline from "./Timeline";
import EsponFuoreChart from "./Charts/EsponFuoreChart";

import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";

class EsponFuoreApp extends React.PureComponent {
	static contextType = AppContext;

	constructor() {
		super();
		this.state = {
			chartsHeight: 300,
			chartsWidth: 500
		}
	}

	render() {
		const props = this.props;

		const allowLegend = props.attribute && props.attribute.data.valueType === 'relative';

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
																<FuoreMap>
																	<FuoreMapPresentation />
																</FuoreMap>
															</MapSet>
															<MapTools>
																<MapControlLegend
																	disabled = {!allowLegend}
																	setKey={this.context.windowSetKey}
																	windowSetKey={this.context.windowSetKey}
																	itemKey={"legend"}
																	mapSetKey={this.context.mapSetKey} />
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
											maxWidth: "35rem",
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
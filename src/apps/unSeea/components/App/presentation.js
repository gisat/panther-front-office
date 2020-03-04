import React from "react";
import Helmet from "react-helmet";

import {AdjustableColumns} from '@gisatcz/ptr-atoms';
import {Deprecated_MapSet, Deprecated_MapControls} from "@gisatcz/ptr-deprecated";
import Map from "./Map";
import MapPresentation from "./Map/presentation";

import ReactResizeDetector from 'react-resize-detector';
import {HoverHandler} from "@gisatcz/ptr-core";

import InfoPanel from "./InfoPanel/presentation";

import AppContext from './context/context';

import {MapTools} from '@gisatcz/ptr-maps';
import {WindowsContainer} from '@gisatcz/ptr-components';
import {connects} from '@gisatcz/ptr-state';

const ConnectedWindowsContainer = connects.WindowsContainer(WindowsContainer);

class App extends React.PureComponent {

	static contextType = AppContext;

	render() {
		const props = this.props;

			return (
				<div className="un_seea-app">
					<HoverHandler>
							<Helmet>
								<title>
									UN SEEA
								</title>
							</Helmet>
							<div className="un_seea-content">
								<ConnectedWindowsContainer setKey={this.context.windowSetKey}>
									<AdjustableColumns
										fixed
										content={[
											{
												render: props => (
													<ReactResizeDetector
														key="11"
														handleWidth
														handleHeight
														render={({ width, height }) => {return (
															<>
																<Deprecated_MapSet
																	mapSetKey={this.context.mapSetKey}
																	activeAttributeKey={this.props.activeAttributeKey}
																	layerTreesFilter={{applicationKey: this.context.applicationKey}}
																	width={width}
																	height={height}
																>
																	<Map activeMapAttributeKey={this.context.activeAttributeKey}>
																		<MapPresentation 
																			vectorLayerStyleKey={this.context.vectorLayerStyleKey}
																			activeAttributeKey={this.context.activeAttributeKey}
																		/>
																	</Map>
																</Deprecated_MapSet>
																<MapTools>
																	<Deprecated_MapControls zoomOnly/>
																</MapTools>
															</>
															)
														}}
													/>
												)
											},
											{
												width: "65%",
												minWidth: "20rem",
												maxWidth: "65rem",
												render: props => (
													<InfoPanel 
														activeChartSet={this.context.activeChartSet}
														activeAttributeKey={this.context.activeAttributeKey}

													/>
													)
											},
										]}
									/>
								</ConnectedWindowsContainer>
							</div>
					</HoverHandler>
				</div>
			);
	}
}


export default App;
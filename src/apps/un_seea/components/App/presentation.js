import React from "react";
import Helmet from "react-helmet";

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import Map from "./Map";
import MapPresentation from "./Map/presentation";
import MapControls from "../../../../components/common/maps/MapControls";
import MapControlLegend from "../../../../components/common/maps/MapControlLegend";
import MapTools from "../../../../components/common/maps/MapTools";

import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";


import AppContext from '../../context';

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
							<WindowsContainer setKey={this.context.windowSetKey}>
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
															<MapSet
																mapSetKey={this.context.mapSetKey}
																activeAttributeKey={this.props.activeAttributeKey}
																layerTreesFilter={{applicationKey: 'un_seea'}}
																width={width}
																height={height}
															>
																<Map>
																	<MapPresentation />
																</Map>
															</MapSet>
															<MapTools>
																<MapControlLegend
																	disabled = {false}
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
												<div
												key="22">
													<h3>
														content
													</h3>
												</div>
												)
										},
									]}
								/>
							</WindowsContainer>
						</div>
					</HoverHandler>
				</div>
			);
	}
}


export default App;
import React from "react";
import Helmet from "react-helmet";

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import Map from "./Map";
import MapPresentation from "./Map/presentation";
import MapControls from "../../../../components/common/maps/MapControls";
import MapTools from "../../../../components/common/maps/MapTools";

import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";

import InfoPanel from "./InfoPanel/presentation";

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
																<MapControls zoomOnly/>
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
												<InfoPanel />
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
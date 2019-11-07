import React from "react";
import Helmet from "react-helmet";

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/Deprecated_MapSet";
import Map from "./Map";
import MapPresentation from "./Map/presentation";
import MapControls from "../../../../components/common/maps/Deprecated_MapControls";
import MapTools from "../../../../components/common/maps/MapTools";

import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";

import InfoPanel from "./InfoPanel/presentation";

import AppContext from './context/context';

class App extends React.PureComponent {

	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.onActiveMapChanged = this.onActiveMapChanged.bind(this);
	}


	onActiveMapChanged(mapSet, mapSetKey) {
		//sync navigator
		this.props.onActiveMapSetChanged(mapSet, mapSetKey, this.props.worldWindNavigator);
		this.context.updateContext({
			mapSetKey,
		})
	}

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
																</MapSet>
																<MapTools>
																	<MapControls/>
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
														onActiveMapChanged={this.onActiveMapChanged}
													/>
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
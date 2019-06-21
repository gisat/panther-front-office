import React from "react";
import Helmet from "react-helmet";

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import UtepSdgMap from "./Map";
import UtepSdgMapPresentation from "./Map/presentation";
import MapControls from "../../../../components/common/maps/MapControls";
import MapControlLegend from "../../../../components/common/maps/MapControlLegend";
import MapTools from "../../../../components/common/maps/MapTools";

import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";


import AppContext from '../../context';
import UtepSdgCharts from "./Charts/UtepSdgCharts";

class UtepSdg extends React.PureComponent {

	static contextType = AppContext;

	render() {
		const props = this.props;

			return (
				<div className="utep_sdg_11_3_1-app">
					<HoverHandler>
						<Helmet><title>UTEP SDG 11.3.1</title></Helmet>
						<div className="utep_sdg_11_3_1-content">
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
																layerTreesFilter={{applicationKey: 'utep_sdg_11_3_1'}}
																width={width}
																height={height}
															>
																<UtepSdgMap>
																	<UtepSdgMapPresentation />
																</UtepSdgMap>
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
											width: "40%",
											minWidth: "20rem",
											maxWidth: "35rem",
											render: props => (
												<UtepSdgCharts
													key="utep_sdg_11_3_1-charts"/>
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


export default UtepSdg;
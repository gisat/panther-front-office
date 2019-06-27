import React from "react";
import Helmet from "react-helmet";
import classnames from 'classnames';

import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import UtepSdgMap from "./Map";
import UtepSdgMapPresentation from "./Map/presentation";
import MapControls from "../../../../components/common/maps/MapControls";
import MapTools from "../../../../components/common/maps/MapTools";

import ReactResizeDetector from 'react-resize-detector';
import HoverHandler from "../../../../components/common/HoverHandler/HoverHandler";


import AppContext from '../../context';
import UtepSdgCharts from "./Charts/UtepSdgCharts";
import UtepSdgHeader from "./UtepSdgHeader";
import uTepLogo from '../../assets/urban-tep-logo.png';

class UtepSdg extends React.PureComponent {

	static contextType = AppContext;

	render() {
		const props = this.props;
		let classes = classnames("utep_sdg_11_3_1-app", {
			'ptr-dark': props.dark
		});

			return (
				<div className={classes}>
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
																<MapControls
																	zoomOnly
																/>
															</MapTools>
														</>
														)
													}}
												/>
											)
										},
										{
											width: "60%",
											minWidth: "30rem",
											render: props => (
												<div className="utep_sdg_11_3_1-right-panel">
													<UtepSdgHeader/>
													<UtepSdgCharts key="utep_sdg_11_3_1-charts"/>
													<div className="utep_sdg_11_3_1-footer">
														<a className="utep_sdg_11_3_1-footer-logo" title="Urban TEP" href="https://urban-tep.eu" target="_blank">
															<div>Powered by</div>
															<img alt="UTEP" src={uTepLogo}/>
														</a>
													</div>
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


export default UtepSdg;
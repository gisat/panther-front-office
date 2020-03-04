import React from "react";
import Helmet from "react-helmet";
import classnames from 'classnames';

import {AdjustableColumns} from '@gisatcz/ptr-atoms';
import {Deprecated_MapSet, Deprecated_MapControls} from "@gisatcz/ptr-deprecated";
import UtepSdgMap from "./Map";
import UtepSdgMapPresentation from "./Map/presentation";

import ReactResizeDetector from 'react-resize-detector';
import {HoverHandler} from "@gisatcz/ptr-core";


import AppContext from '../../context';
import UtepSdgCharts from "./Charts/UtepSdgCharts";
import UtepSdgHeader from "./UtepSdgHeader";
import uTepLogo from '../../assets/urban-tep-logo.png';

import {MapTools, GoToPlace} from '@gisatcz/ptr-maps';
import {connects} from '@gisatcz/ptr-state';
import {WindowsContainer} from '@gisatcz/ptr-components';

const ConnectedWindowsContainer = connects.WindowsContainer(WindowsContainer);

const ConnectedGoToPlace = connects.GoToPlace(GoToPlace);

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
							<ConnectedWindowsContainer setKey={this.context.windowSetKey}>
								<ReactResizeDetector
									handleWidth
									render={({ width }) => {
										return (
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
																		layerTreesFilter={{applicationKey: 'utep_sdg_11_3_1'}}
																		width={width}
																		height={height}
																	>
																		<UtepSdgMap>
																			<UtepSdgMapPresentation />
																		</UtepSdgMap>
																	</Deprecated_MapSet>
																	<MapTools>
																		<Deprecated_MapControls
																			zoomOnly
																		/>
																	</MapTools>
																	<div className="utep_sdg_11_3_1-map-go-to-wrapper ptr-light">
																		<ConnectedGoToPlace/>
																	</div>
																</>
															)
															}}
														/>
													)
												},
												{
													width: width > 600 ? "60%" : "100%" ,
													minWidth: width > 600 ? "30rem" : null,
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
									)
									}}
								/>
							</ConnectedWindowsContainer>
						</div>
					</HoverHandler>
				</div>
			);
	}
}


export default UtepSdg;
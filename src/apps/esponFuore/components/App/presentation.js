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
import MapControls from "../../../../components/common/maps/MapControls";
import ChartSet from '../../../../components/common/charts/ChartSet';
import EsponFuoreTimeline from "./Timeline";
import EsponFuoreChart from "./Charts/EsponFuoreChart";
import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";

import sample_4 from "../../../../components/common/charts/mockData/sample_4.json";
import sample_15 from "../../../../components/common/charts/mockData/sample_15.json";
import sample_50 from "../../../../components/common/charts/mockData/sample_50.json";
import sample_200 from "../../../../components/common/charts/mockData/sample_200.json";
import ChartWrapper from "../../../../components/common/charts/ChartWrapper/ChartWrapper";

import ReactResizeDetector from 'react-resize-detector';
import LineChart from "../../../../components/common/charts/LineChart/LineChart";

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

		if (!props.activeScopeKey) {

			return React.createElement(LandingPage);

		} else {

			return (
				<div className="esponFuore-app">
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
															layerTreesFilter={{applicationKey: 'esponFuore'}}
															width={width}
															height={height}
														>
															<FuoreMap>
																<FuoreMapPresentation />
															</FuoreMap>
														</MapSet>
														<MapControls/>
													</>
													)
												}}
											/>
										)
									},
									{
										width: "35rem",
										render: props => (
											<ChartSet>
												Temporarly not rendered
												{/*<EsponFuoreChart*/}
													{/*chartKey="fuoreTestChart"*/}
													{/*title="Put chart title here"*/}
												{/*/>*/}
												{/*<EsponFuoreChart*/}
													{/*chartKey="fuoreTestAllPeriods"*/}
													{/*title="Put chart title here"*/}
												{/*/>*/}
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
				</div>
			);
		}
	}
}


export default EsponFuoreApp;
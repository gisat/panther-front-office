import React from "react";
import Helmet from "react-helmet";

import AppContext from '../../context';

import LandingPage from '../LandingPage';
import Header from '../Header';
import AdjustableColumns from '../../../../components/common/atoms/AdjustableColumns';
import WindowsContainer from '../../../../components/common/WindowsContainer';
import MapSet from "../../../../components/common/maps/MapSet";
import MapControls from "../../../../components/common/maps/MapControls";
import ChartsContainer from '../../../../components/common/charts/ChartsContainer';
import EsponFuoreTimeline from "./Timeline";
import ColumnChart from "../../../../components/common/charts/ColumnChart/ColumnChart";

import sample_50 from "../../../../components/common/charts/mockData/sample_50.json";
import sample_200 from "../../../../components/common/charts/mockData/sample_200.json";

class EsponFuoreApp extends React.PureComponent {
	static contextType = AppContext;

	constructor() {
		super();
		this.state = {
			chartsHeight: 300,
			chartsWidth: 500
		}
	}

	onChartsClick() {
		this.setState({
			chartsHeight: this.state.chartsHeight * 0.9,
			chartsWidth: this.state.chartsWidth * 0.9
		});
	}

	onChartsRightClick() {
		this.setState({
			chartsHeight: this.state.chartsHeight / 0.9,
			chartsWidth: this.state.chartsWidth / 0.9
		});
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
											<>
												<MapSet
													mapSetKey={this.context.mapSetKey}
													layerTreesFilter={{applicationKey: 'esponFuore'}}
												/>
												<MapControls/>
											</>
										)
									},
									{
										width: "35rem",
										render: props => (
											<div onClick={this.onChartsClick.bind(this)} onContextMenu={this.onChartsRightClick.bind(this)}>
												<ChartsContainer>
													<h3>50</h3>
													<ColumnChart
														key="test3"
														width={this.state.chartsWidth}
														height={this.state.chartsHeight}
														data={sample_50}
														keySourcePath="key"
														xSourcePath="data.name"
														ySourcePath="data.some_value_1"
														sorting={[["data.some_value_1", "desc"]]}
													/>
													<h3>200</h3>
													<ColumnChart
														key="test7"
														width={this.state.chartsWidth}
														height={this.state.chartsHeight}
														data={sample_200}
														keySourcePath="key"
														xSourcePath="data.name"
														ySourcePath="data.some_value_1"
														sorting={[["data.some_value_1", "desc"]]}
													/>
												</ChartsContainer>
											</div>
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
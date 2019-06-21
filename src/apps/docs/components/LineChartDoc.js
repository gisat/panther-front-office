import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import LineChart from "../../../components/common/charts/LineChart/LineChart";

import sample_serie_7 from "./mockData/sample_serie_7";
import sample_serie_30 from "./mockData/sample_serie_30";
import sample_serie_500 from "./mockData/sample_serie_500";
import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";

class LineChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			width: null
		};
		this.ref = React.createRef();

		this.resize = this.resize.bind(this);
	}

	resize() {
		this.setState({
			width: (window.innerWidth) - 270 // TODO do it better
		})
	}

	componentDidMount() {
		this.resize();
		if (window) window.addEventListener('resize', this.resize, {passive: true}); //todo IE
	}

	render() {
		return (
			<div className="ptr-docs-panel-content" ref={this.ref}>
				<div className="ptr-docs-panel-section">
					<h2>Basic settings</h2>
					<p>Resize window to see responsiveness.</p>
					<HoverHandler>
						<LineChart
							key="test1"
							data={sample_serie_7}
							serieKeySourcePath="key"
							serieNameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							// withoutYbaseline

							sorting={[["period", "asc"]]}

							xCaptionsSize={50}
							width={this.state.width}

							legend
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>With points</h2>
					<HoverHandler>
						<LineChart
							key="test2"
							data={sample_serie_7}
							serieKeySourcePath="key"
							serieNameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							withoutYbaseline

							sorting={[["period", "asc"]]}

							xCaptionsSize={50}

							withPoints
							width={this.state.width}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Force aggregated</h2>
					<HoverHandler>
						<LineChart
							key="test4"
							data={sample_serie_7}
							serieKeySourcePath="key"
							serieNameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							forceMode="aggregated"

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							withoutYbaseline

							xCaptionsSize={50}

							withPoints
							width={this.state.width}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Force gray</h2>
					<HoverHandler>
						<LineChart
							key="test5"
							data={sample_serie_7}
							serieKeySourcePath="key"
							serieNameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							forceMode="gray"

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							withoutYbaseline
							sorting={[["period", "asc"]]}


							xCaptionsSize={50}

							withPoints
							width={this.state.width}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>More than 10 series</h2>
					<HoverHandler>
						<LineChart
							key="test3"
							data={sample_serie_30}
							serieKeySourcePath="key"
							serieNameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							withoutYbaseline

							xCaptionsSize={50}

							withPoints
							width={this.state.width}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>More than 50 series</h2>
					<HoverHandler>
						<LineChart
							key="test500"
							data={sample_serie_500}
							serieKeySourcePath="key"
							serieNameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period" // in context of serie
							ySourcePath="someStrangeValue" // in context of serie

							xTicks
							xGridlines
							xCaptions
							yTicks
							yGridlines
							yCaptions
							withoutYbaseline

							xCaptionsSize={50}

							withPoints
							width={this.state.width}
						/>
					</HoverHandler>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(LineChartDoc);
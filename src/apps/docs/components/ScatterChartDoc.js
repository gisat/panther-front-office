import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import HoverHandler from "../../../components/common/HoverHandler/HoverHandler";
import ScatterChart from "../../../components/common/charts/ScatterChart/ScatterChart";

import sample_4 from "./mockData/sample_4";
import sample_50 from "./mockData/sample_50";
import sample_serie_10 from "./mockData/scatterChart/serie_10";

class ScatterChartDoc extends React.PureComponent {
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
					<p></p>
					<HoverHandler>
						<ScatterChart
							key="scatter-doc-basic"
							data={sample_50}

							xSourcePath="data.some_value_1"
							ySourcePath="data.some_value_2"
							nameSourcePath="data.name"
							keySourcePath="key"

							xGridlines
							xCaptions
							xTicks

							yGridlines
							yCaptions
							yTicks

							width={this.state.width}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Specified colors and custom sizes</h2>
					<p>Custom width, height, point radius, inner padding</p>
					<HoverHandler>
						<ScatterChart
							key="scatter-doc-colors"
							data={sample_4}

							xSourcePath="data.some_value_1"
							ySourcePath="data.some_value_2"
							nameSourcePath="data.name"
							keySourcePath="key"
							colorSourcePath="data.color"

							xGridlines
							xCaptions
							xTicks

							yGridlines
							yCaptions
							yTicks

							width={300}
							height={200}
							innerPadding={20}
							pointRadius={7}
						/>
					</HoverHandler>
				</div>

				<div className="ptr-docs-panel-section">
					<h2>Data source is serie</h2>
					<p></p>
					<HoverHandler>
						<ScatterChart
							key="scatter-doc-serie"
							data={sample_serie_10}
							isSerie

							serieDataSourcePath="data.data"
							nameSourcePath="data.name"
							colorSourcePath="data.color"
							keySourcePath="key"

							xSourcePath="someStrangeValue" // in context of serie
							ySourcePath="otherValue" // in context of serie
							itemNameSourcePath="period" // in context of serie

							xGridlines
							xCaptions
							xTicks

							yGridlines
							yCaptions
							yTicks

							width={this.state.width}
						/>
					</HoverHandler>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(ScatterChartDoc);
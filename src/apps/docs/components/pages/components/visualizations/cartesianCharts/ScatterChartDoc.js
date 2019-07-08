import React from 'react';
import {withNamespaces} from "react-i18next";
import _ from 'lodash';
import HoverHandler from "../../../../../../../components/common/HoverHandler/HoverHandler";
import ScatterChart from "../../../../../../../components/common/charts/ScatterChart/ScatterChart";

import sample_4 from "../../../../mockData/sample_4";
import sample_50 from "../../../../mockData/sample_50";
import sample_serie_10 from "../../../../mockData/scatterChart/serie_10";
import Page from "../../../../Page";

class ScatterChartDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="Scatter chart">
				<div ref={this.ref}>
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
								xValues
								xTicks
	
								yGridlines
								yValues
								yTicks
							/>
						</HoverHandler>
					</div>
	
					<div className="ptr-docs-panel-section">
						<h2>Specified colors and custom sizes</h2>
						<p>Custom width, height, point radius, inner padding, min, max</p>
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
								xValues
								xTicks
	
								yGridlines
								yValues
								yTicks
	
								xOptions={{
									min: -1000,
									max: 70000
								}}
	
								yOptions={{
									min: -15,
									max: 18
								}}
	
								width={350}
								height={200}
								innerPadding={20}
								pointRadius={7}
							/>
						</HoverHandler>
					</div>
	
					<div className="ptr-docs-panel-section">
						<h2>Data source is serie</h2>
						<p>With axis labels</p>
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
								xOptions={{
									name: "Attribut X",
									unit: "inhabitants"
								}}
								ySourcePath="otherValue" // in context of serie
								yOptions={{
									name: "Attribut Y",
									unit: "%"
								}}
								itemNameSourcePath="period" // in context of serie
	
								xGridlines
								xValues
								xValuesSize={45}
								xTicks
								xLabel
	
								yGridlines
								yValues
								yTicks
								yLabel

								legend
							/>
						</HoverHandler>
					</div>
				</div>
			</Page>
		);
	}
}

export default withNamespaces()(ScatterChartDoc);
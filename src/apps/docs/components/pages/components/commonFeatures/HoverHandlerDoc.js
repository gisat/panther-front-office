import React from 'react';
import ComponentPropsTable from "../../../ComponentPropsTable/ComponentPropsTable";
import Page, {DocsToDo} from "../../../Page";
import {HoverHandler} from "@gisatcz/ptr-core";
import {LeafletMap} from "@gisatcz/ptr-maps";
import {AsterChart, ColumnChart, LineChart, ScatterChart} from '@gisatcz/ptr-charts';

import sample_10 from "../../../mockData/scatterChart/serie_10";
import dodoma from "../../../mockData/map/dodoma_districts_as_us_states";

class HoverHandlerDoc extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Page title="HoverHandler">
				<DocsToDo>Add description</DocsToDo>
				<h2 id="props">Props</h2>
				<ComponentPropsTable
					content={[
						{
							name: "selectedItems",
							type: "array",
							description: "List of selected items keys."
						}
					]}
				/>

				<h2 id="usage">Usage</h2>
				<div style={{maxWidth: '40rem'}}>
					<HoverHandler
						selectedItems={["e716114f-b36e-4c39-9069-e00fda51e85c", "28bf9648-2031-4b2b-af60-cfa650a4d938"]}
					>
						<LineChart
							key="hover-handler-doc-line-chart"
							data={sample_10}

							keySourcePath="key"
							nameSourcePath="data.name"
							serieDataSourcePath="data.data"
							xSourcePath="period"
							ySourcePath="someStrangeValue"

							sorting={[["period", "asc"]]}
						/>
						<ColumnChart
							key="hover-handler-doc-column-chart"
							data={sample_10}

							keySourcePath="key"
							nameSourcePath="data.name"
							xSourcePath="data.name"
							ySourcePath="data.data[0].someStrangeValue"

							xValuesSize={5}

							diverging
						/>
						<ScatterChart
							key="hover-handler-doc-scatter-chart"
							data={sample_10}

							keySourcePath="key"
							nameSourcePath="data.name"
							xSourcePath="data.data[0].someStrangeValue"
							ySourcePath="data.data[0].otherValue"
						/>
						<AsterChart
							key="hover-handler-doc-aster-chart"
							data={sample_10}
							keySourcePath="key"
							nameSourcePath="data.name"
							valueSourcePath="data.data[0].someStrangeValue"
						/>
						<div style={{height: '20rem'}}>
							<LeafletMap
								mapKey='hover-handler-docs-leaflet-map'
								view={{
									center: {
										lat: -6.15,
										lon: 35.75
									},
									boxRange: 70000
								}}
								backgroundLayer={{
									key: 'background-osm',
									type: 'wmts',
									options: {
										url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
									}
								}}
								layers={[
									{
										key: 'dodomaAuLevel3',
										name: 'Analytical units 3',
										type: 'vector',
										options: {
											features: dodoma,
											keyProperty: 'AL3_ID',
											nameProperty: 'AL3_NAMEF'
										}
									}
								]}
							/>
						</div>
					</HoverHandler>
				</div>
			</Page>
		);
	}
}

export default HoverHandlerDoc;